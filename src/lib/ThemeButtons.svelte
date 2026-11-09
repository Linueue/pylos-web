<script lang="ts">
    import Moon from '@lucide/svelte/icons/moon';
    import Sun from '@lucide/svelte/icons/sun';
    import { onMount } from "svelte";
    import { themeState, toggleTheme, initTheme } from "./theme.svelte"

    onMount(() => {
        initTheme();
    })
</script>

<button class="btn preset-filled bg-transparent" onclick={toggleTheme}>
    {#if themeState.mode == 'light'}
        <Sun color="black" />
    {:else}
        <Moon color="white" />
    {/if}
</button>
