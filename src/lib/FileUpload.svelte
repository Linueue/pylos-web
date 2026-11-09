<script lang="ts">
    import Upload from '@lucide/svelte/icons/file-up';

    let { code = $bindable() } = $props();
    let fileInput: HTMLInputElement;

    function handleFile(event: Event) {
        const target = event.target as HTMLInputElement;

        if(!target.files || target.files.length !== 1)
            return;

        const file = target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            if(e.target?.result) {
                code = e.target.result as string;
            }
        };

        reader.onerror = () => {
            console.error("Error reading file.");
        };

        reader.readAsText(file);
    }
</script>

<label for="pylos-file" class="flex flex-row gap-1 items-center">
    <Upload size={15} color="var(--color-surface-500)" />
    <span class="text-surface-700-300 label-text">Load</span>
</label>
<input
    type="file"
    id="pylos-file"
    class="hidden"
    accept=".pyl,.pls,.txt"
    bind:this={fileInput}
    onchange={handleFile}
/>
