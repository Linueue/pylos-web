<script lang="ts">
    import { onMount } from "svelte"

    let { data, scroll }: { data: any, scroll: boolean } = $props();
    let elem: HTMLDivElement;

    onMount(() => {
        if(!scroll)
            return;

        elem.scrollIntoView({ behavior: "smooth" })
    });
</script>

<div bind:this={elem} class="card flex w-full p-2 px-5 bg-surface-50-950 my-1">
{#if data.isErr}
    <div class="text-red-600">
        {data.errorLog} at line {data.line}, column {data.column}
    </div>
{:else}
    <div class="flex flex-col">
        <div class="text-xs text-surface-500">
            {data.typeName}
        </div>
        "{data.lexeme}"
    </div>
{/if}
    <div class="flex ml-auto text-xs text-surface-500">
        line {data.line}, column {data.column}
    </div>
</div>
