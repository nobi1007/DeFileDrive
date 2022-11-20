import { Web3Storage } from "web3.storage";

function getAccessToken() {
    // If you're just testing, you can paste in a token
    // and uncomment the following line:
    // return 'paste-your-token-here'

    // In a real app, it's better to read an access token from an
    // environement variable or other configuration that's kept outside of
    // your code base. For this to work, you need to set the
    // WEB3STORAGE_TOKEN environment variable before you run your code.
    return process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN;
}

function makeStorageClient() {
    return new Web3Storage({ token: getAccessToken() });
}

async function makeFileObjects(fileObjects) {
    // [{name:"", content:""}: {name:string, content: dataUrl}]
    const eachFile = fileObjects[0];

    const blob = await (await fetch(eachFile.content)).blob();
    const file = new File([blob], eachFile.name, { type: "image/png" });

    // You can create File objects from a Blob of binary data
    // see: https://developer.mozilla.org/en-US/docs/Web/API/Blob
    // Here we're just storing a JSON object, but you can store images,
    // audio, or whatever you want!
    // const obj = { hello: 'world' }
    // const blob = new Blob([JSON.stringify(obj)], { type: 'application/json' })

    const files = [file];
    return files;
}

async function storeWithProgress(files) {
    // show the root cid as soon as it's ready
    const onRootCidReady = (cid) => {
        console.log("uploading files with cid:", cid);
    };

    // when each chunk is stored, update the percentage complete and display
    const totalSize = files.map((f) => f.size).reduce((a, b) => a + b, 0);
    let uploaded = 0;

    const onStoredChunk = (size) => {
        uploaded += size;
        const pct = 100 * (uploaded / totalSize);
        console.log(`Uploading... ${pct.toFixed(2)}% complete`);
    };

    // makeStorageClient returns an authorized web3.storage client instance
    const client = makeStorageClient();

    // client.put will invoke our callbacks during the upload
    // and return the root cid when the upload completes
    return await client.put(files, { onRootCidReady, onStoredChunk });
}

export { makeFileObjects, storeWithProgress };
