<script lang="ts">
    import { initWasm, isWasmReady, runLexer } from "#lib/Lexer.svelte.ts"
    import Token from "#lib/Token.svelte"
    import ThemeButtons from "#lib/ThemeButtons.svelte"
    import FileUpload from "#lib/FileUpload.svelte"
    import { onMount } from "svelte"
    import CodeMirror from "svelte-codemirror-editor"
    import { kotlin } from "@fazelstudio/codemirror-lang-kotlin"
    import { oneDark } from "@codemirror/theme-one-dark"
    import { ayuLight } from "codemirror-theme-ayu"
    import { themeState } from "#lib/theme.svelte.ts"
    import { setDiagnostics } from "@codemirror/lint"
    import type { EditorView } from "@codemirror/view"

    let code = $state("");
    let tokens = $state([]);

    let editorView: EditorView | undefined;
    let editorTheme = $derived(themeState.mode === 'dark' ? oneDark : ayuLight);

    $effect(() => {
        if(isWasmReady() && code.trim() != "") {
            const toks: any = runLexer(code);
            tokens = toks;
            
            if(editorView) {
                const diagnostics = toks
                    .filter((t: any) => t.isErr)
                    .map((err: any) => {
                        const line = editorView!.state.doc.line(err.line);
                        const from = line.from + (err.column - 1);
                        const to = Math.min(from + (err.lexeme?.length || 1), line.to);

                        return {
                            from,
                            to,
                            severity: "error" as const,
                            message: err.errorLog,
                        };
                    });

                editorView.dispatch(setDiagnostics(editorView.state, diagnostics));
            }
        }
    });

    onMount(async () => {
        await initWasm();
    });
</script>

<div class="bg-surface-100-900 p-4 h-screen w-full mx-auto space-y-4">
	<header class="flex flex-row items-center p-1">
		<h3 class="h3 bg-linear-to-r from-surface-500 to-secondary-500 bg-clip-text text-transparent">Pylos</h3>
        <div class="mx-5 px-3 py-1 rounded-md bg-surface-300-700">
        {#if isWasmReady()}
            <h5>Wasm is ready</h5>
        {:else}
            <h5>Wasm is loading...</h5>
        {/if}
        </div>
        <div class="ml-auto">
            <ThemeButtons />
        </div>
	</header>
    <div class="flex flex-col md:flex-row gap-3 h-[80vh] md:h-[calc(100vh-100px)]">
        <div class="flex-1 flex flex-col h-full">
            <div class="flex flex-1 flex-col h-full">
                <div class="py-1 flex flex-row items-center space-between w-full">
                    <span class="label-text">Code</span>
                    <div class="ml-auto">
                        <FileUpload bind:code={code} />
                    </div>
                </div>
                <CodeMirror
                    class="flex flex-1 w-full h-full text-[15px]"
                    bind:value={code}
                    lang={kotlin()}
                    theme={editorTheme}
                    onready={(e) => editorView = e}
                />
            </div>
        </div>
        <div class="flex-[0.5] flex flex-col">
            <div class="py-1">
                <span class="label-text">Tokens</span>
            </div>
            <div class="card overflow-y-auto max-h-full">
                {#each tokens as token, idx}
                    <Token data={token} scroll={idx == (tokens.length - 1)} />
                {/each}
            </div>
        </div>
    </div>
</div>

<style>
    :global(.cm-editor) {
        width: 100%;
        height: 100%;
        min-height: 200px;
        border-radius: 5px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

    :global(.cm-scroller) {
        overflow: auto;
        flex: 1;
    }
</style>
