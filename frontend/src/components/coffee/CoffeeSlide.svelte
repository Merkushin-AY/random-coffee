<script lang="ts">
    import getColorForText from '~/utils/getColorForText';
    import type { Coffee, LoadingCoffee } from '~/types/Coffee';

    export let coffee: Coffee | LoadingCoffee;

    let notesElement;

    $: if (coffee?.isLoading) coffee.notes = new Array(3).fill(''); // for skeleton animation

    function handleScroll(e) {
        e.preventDefault();
        e.stopPropagation();
        notesElement.scrollLeft += e.deltaY / 3;
    }
</script>

{#if coffee}
    <div class="coffeeSlide">
        <img
            class="coffeeSlide_image coffeeSlide_skeleton"
            src={coffee.image}
            alt={coffee.blend_name || ''}
        />
        <div class="coffeeSlide_texts">
            <p class="coffeeSlide_origin" class:coffeeSlide_skeleton={coffee.isLoading}>{coffee.origin || ''}</p>
            <p class="coffeeSlide_name" class:coffeeSlide_skeleton={coffee.isLoading}>{coffee.blend_name || ''}</p>
            <p class="coffeeSlide_variety" class:coffeeSlide_skeleton={coffee.isLoading}>{coffee.variety || ''}</p>
        </div>
        {#if coffee.notes?.length}
            <div class="coffeeSlide_notes" on:wheel={handleScroll} bind:this={notesElement}>
                {#each coffee.notes as note}
                    <span class="coffeeSlide_note" class:coffeeSlide_skeleton={coffee.isLoading}
                          style="--color: {getColorForText(note, '38')}">
                        {note}
                    </span>
                {/each}
            </div>
        {/if}
    </div>
{/if}


<style>
    .coffeeSlide {
        display: flex;
        flex-flow: column;
        max-width: 100%;
        width: 320px;
        min-height: 400px;
        border-radius: 24px;
        color: #020101;
        background: #E8B0A7;
        box-shadow: 0 0 13px 6px #222222;
        overflow: hidden;
    }

    .coffeeSlide_image {
        width: 100%;
        height: 240px;
        object-fit: cover;
        border-radius: 14px;
    }

    .coffeeSlide_texts {
        display: flex;
        flex-flow: column;
        padding: 16px;
        gap: 8px;
    }

    .coffeeSlide_texts p {
        margin: 0;
    }

    .coffeeSlide_origin {
        letter-spacing: 0.15em;
        min-height: 18px;
    }

    .coffeeSlide_origin.coffeeSlide_skeleton {
        max-width: 140px;
        border-radius: 2px;
    }

    .coffeeSlide_name {
        min-height: 26px;
        font-weight: bold;
        font-size: 22px;
        letter-spacing: 0.02em;
    }

    .coffeeSlide_name.coffeeSlide_skeleton {
        max-width: 180px;
        border-radius: 2px;
    }

    .coffeeSlide_variety.coffeeSlide_skeleton {
        max-width: 100px;
        border-radius: 2px;
        min-height: 18px;
    }

    .coffeeSlide_notes {
        display: flex;
        box-sizing: border-box;
        width: 100%;
        padding: 0 16px;
        overflow-x: auto;
        gap: 4px;
        scroll-behavior: smooth;
    }

    .coffeeSlide_notes::-webkit-scrollbar {
        width: 4px;
        opacity: 0;
    }

    .coffeeSlide_note {
        white-space: nowrap;
        padding: 4px 8px;
        border-radius: 8px;
        background: var(--color);
        letter-spacing: 0.1em;
        box-shadow: inset -1px -2px 3px 0 #7e605aa8;
    }

    .coffeeSlide_note.coffeeSlide_skeleton {
        min-height: 18px;
        min-width: 48px;
    }

    .coffeeSlide_skeleton {
        animation: skeleton 0.8s linear infinite alternate;
    }


    @keyframes skeleton {
        0% {
            background-color: #65789C9E;
        }
        100% {
            background-color: #65789C;
        }
    }

    @media (max-width: 480px) {
        .coffeeSlide {
            width: 240px;
            min-height: 320px;
        }

        .coffeeSlide_image {
            height: 160px;
        }
    }
</style>