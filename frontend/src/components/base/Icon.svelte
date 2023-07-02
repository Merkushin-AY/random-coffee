<script lang="ts">
    import { iconHtmls } from '~/utils/icons';

    export let name: keyof typeof iconHtmls;
</script>

{@html iconHtmls[name] || ''}
