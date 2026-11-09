let _isWasmReady = $state(false);
let resultPtr: any = null
let errBufPtr: any = null

let ModuleInstance: any;

export const isWasmReady = () => {
    return _isWasmReady;
}

export const initWasm = async () => {
    const script = document.createElement("script");
    script.src = "/pylos.js";
    script.async = true;
    document.head.appendChild(script);

    script.onload = async () => {
        if(window.createPylosModule) {
            ModuleInstance = await window.createPylosModule({
                locateFile: (path: string) => {
                    if(path.endsWith(".wasm")) return "/pylos.wasm";
                    return path;
                }
            });
            _isWasmReady = true;
            const M = ModuleInstance;
            resultPtr = M._malloc(20);
            errBufPtr = M._malloc(256);
        };
    }
}

export const runLexer = (src: string) => {
    if(!isWasmReady || !ModuleInstance)
        return;
    let tokens = [];
    let errorLog = "";

    const M = ModuleInstance;

    const srcLen = M.lengthBytesUTF8(src);
    const srcPtr = M._malloc(srcLen + 1);
    M.stringToUTF8(src, srcPtr, srcLen + 1);

    const lexerHandle = M._lexer_create(srcPtr, srcLen);

    try {
        while(true) {
            const status = M._lexer_next(lexerHandle, resultPtr, errBufPtr, 256);

            const line = M.getValue(resultPtr + 4, "i32");
            const column = M.getValue(resultPtr + 8, "i32");

            if(status == -1) {
                errorLog = M.UTF8ToString(errBufPtr);
                tokens.push({ isErr: true, errorLog, line, column })
                break;
            }

            const typePtr = M.getValue(resultPtr + 0, "*");
            const textPtr = M.getValue(resultPtr + 12, "*");
            const textLen = M.getValue(resultPtr + 16, "i32");

            const typeName = M.UTF8ToString(typePtr);
            const lexeme = M.UTF8ToString(textPtr, textLen);

            tokens.push({ isErr: false, typeName, lexeme, line, column })

            if(typeName == "EndOfFile")
                break;
        }
    } finally {
        M._lexer_destroy(lexerHandle);
        M._free(srcPtr);
    }

    return tokens;
}
