<script lang="ts">
    import { browser } from "$app/environment";
    import { onMount } from 'svelte';
    import VerticalSlider from '~/components/Base/VerticalSlider.svelte';
    import Icon from '~/components/base/Icon.svelte';
    import CoffeeSlide from '~/components/coffee/CoffeeSlide.svelte';
    import type { Coffee, LoadingCoffee } from '~/types/Coffee';
    import { apiUrl } from '~/utils/apiUrl';

    let sliderComponent: typeof VerticalSlider;
    let slideIndex = 0;
    let isSlideLoading = false;
    let slides: Array<Coffee | LoadingCoffee> = []; // store is preferable for bigger apps (with fetch and other logic)
    let autoLoadTimeout: number;

    $: isLastSlide = slideIndex + 1 >= slides.length;
    $: restartAutoLoad() && slideIndex;

    function goNext() {
        sliderComponent?.goNext();
    }

    function goPrev() {
        sliderComponent?.goPrev();
    }

    async function addNew(silent = false) {
        if (isSlideLoading) return;
        isSlideLoading = true;
        slides.push({
            isLoading: true,
        });
        if (!silent) goNext();

        try {
            const resp = await fetch(`${apiUrl}/coffee/${slides.length - 1}`);
            slides[slides.length - 1] = await resp.json();
            isSlideLoading = false;
            restartAutoLoad();
        } catch (e) {
            console.error('Error during coffee fetch', e);
            if (isLastSlide) goPrev();
            delete slides[slides.length - 1];
            isSlideLoading = false;
        }
    }

    function restartAutoLoad() {
        // TODO: maybe currently active browser tab checking is required
        if (!browser) return;
        if (autoLoadTimeout) clearTimeout(autoLoadTimeout);
        if (slides.length > 1000) return; // stop autoload when there are too much slides
        if (isSlideLoading) return;
        autoLoadTimeout = setTimeout(() => {
            addNew(!isLastSlide);
        }, 5000);
    }

    onMount(() => {
        addNew();
    });

</script>

<svelte:head>
    <title>Random Coffee</title>
</svelte:head>

<div class="coffeePage">
    <div class="coffeePage_sliderWrap">
        <VerticalSlider slides={slides} bind:this={sliderComponent} bind:currentSlide={slideIndex}>
            <CoffeeSlide slot="slide" let:slide coffee={slide}/>
        </VerticalSlider>
    </div>
    <div class="coffeePage_sliderButtons">
        <button class="coffeePage_sliderButton" class:disabled={slideIndex <= 0} on:click={goPrev}>
            <Icon name="chevronUp"/>
        </button>
        {#if isLastSlide}
            <button class="coffeePage_sliderButton" class:disabled={isSlideLoading} on:click={() => addNew()}>
                <Icon name="plus"/>
            </button>
        {:else}
            <button class="coffeePage_sliderButton" on:click={goNext}>
                <Icon name="chevronDown"/>
            </button>
        {/if}
    </div>
</div>

<style>
    .coffeePage {
        display: flex;
        flex-flow: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100vh;
        background: linear-gradient(152deg, #967d77, #2d2321);
        overflow-x: hidden;
        overflow-y: auto;
    }

    .coffeePage_sliderWrap {
        min-height: 400px;
    }

    .coffeePage_sliderButtons {
        display: flex;
        gap: 24px;
        margin-top: 24px;
    }

    .coffeePage_sliderButton {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        border: 0;
        border-radius: 50%;
        background: #efe4c8;
        outline: none;
        user-select: none;
        cursor: pointer;
        box-shadow: 0 0 10px 3px #222222;
        transition: scale 0.2s, background 0.2s, box-shadow 0.15s;
    }

    .coffeePage_sliderButton:hover {
        scale: 1.1;
        background: #E8B0A7;
    }

    .coffeePage_sliderButton:active {
        box-shadow: none;
    }

    .coffeePage_sliderButton.disabled {
        background: #bfbab1;
    }

    .coffeePage_sliderButton :global(.icon) {
        fill: #352a28;
    }

    @media (max-width: 480px) {
        .coffeePage_sliderWrap {
            min-height: 320px;
        }
    }
</style>
