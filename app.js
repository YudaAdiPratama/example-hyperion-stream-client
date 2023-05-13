const { HyperionStreamClient } = require("@genesisblockid/hyperion-stream-client");
const fetch = require("node-fetch");
const { JsonRpc } = require('vexaniumjs');

const rpc = new JsonRpc('https://chain-endpoint', { fetch })

const client = new HyperionStreamClient({
    endpoint: "http://stream-endpoint",
    debug: true,
    libStream: true
});

client.on('empty', () => {
    console.log('Queue Empty!');
});

function handler(data) {
    switch (data.type) {
        case 'action': {
            const action = data.content;
            const act = action.act;
            const actData = act.data;
            console.log(`Action - [${data.content.block_num}] [${act.account}::${act.name}] >> ${JSON.stringify(actData)}`);
            console.log(actData)
            break;
        }
        case 'delta': {
            const delta = data.content;
            const row = delta.data;
            console.log(`Delta - [${data.content.block_num}] [${delta.code}::${delta.table}] >> ${JSON.stringify(row)}`);
            break;
        }
    }
}

client.setAsyncDataHandler(handler);

async function run() {
    // connect stream
    await client.connect();

    // get stream acctions
    await client.streamActions({
        contract: 'vex.token',
        action: 'transfer',
        account: 'indodaxvexan',
        start_from: 0,
        read_until: 0,
        filters: [],
      });

    //   get transactions by block_number
      client.on('libUpdate', async (data) => {

        const block = await rpc.get_block(data.block_num);
        if(block.transactions != undefined){
        console.log(block.transactions)
    }else{
        console.log("no data transactions")
    }
    });


}

run().catch(console.log);
