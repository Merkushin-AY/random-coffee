<script lang="ts">
    import { fly } from 'svelte/transition';

    export let slides = [];
    export let currentSlide = 0;

    const maxVisibleSlides = 4;

    let visibleSlides = [];
    let lastDirection: 'up' | 'down' = 'down';

    $: setVisibleSlidesByCurrent(currentSlide, slides);

    export function goNext() {
        return goTo(currentSlide + 1);
    }

    export function goPrev() {
        return goTo(currentSlide - 1);
    }

    export function goTo(slideIdx: number) {
        if (slideIdx >= slides.length || slideIdx < 0) return currentSlide;
        lastDirection = slideIdx >= currentSlide ? 'down' : 'up';
        currentSlide = slideIdx;
        return currentSlide;
    }

    function setVisibleSlidesByCurrent(slideIdx: number, allSlides: any[]) {
        if (!allSlides.length) {
            visibleSlides = [];
            return;
        }

        const newVisibleSlides = [];
        for (let i = 0; i < maxVisibleSlides && slideIdx - i >= 0; i++) {
            newVisibleSlides.push({
                key: (slideIdx - i) + allSlides[slideIdx - i],
                data: allSlides[slideIdx - i],
            });
        }

        visibleSlides = newVisibleSlides;
    }

    function counterTransition(el, params) {
        if (params.direction === 'down') params.y *= -1;
        return fly(el, params)
    }

    // TODO: add swipe handlers
    function handleWheel(e: WheelEvent) {
        if (e.deltaY > 0) {
            goNext();
        } else {
            goPrev();
        }
    }
</script>

<div class="verticalSlider">
    <div class="verticalSlider_slides" on:wheel={handleWheel}>
        {#each visibleSlides as slide, i (slide.key)}
            <div
                class="verticalSlider_slide"
                class:isCurrent={i === 0}
                style="--index: {i}"
                transition:fly={{ y: 50, opacity: 0 }}
            >
                <slot name="slide" slide={slide.data}>
                    {slide.data}
                </slot>
            </div>
        {/each}
    </div>
    {#if visibleSlides.length}
        {#key currentSlide}
            <div
                class="verticalSlider_counter"
                out:counterTransition={{ y: 30, opacity: 0, duration: 800, direction: lastDirection }}
                in:counterTransition={{ y: -30, opacity: 1, duration: 800, direction: lastDirection }}
            >
                {currentSlide + 1}
            </div>
        {/key}
    {/if}
</div>

<style>
    .verticalSlider {
        position: relative;
        display: flex;
        align-items: center;
        gap: 32px;
    }

    .verticalSlider_slides {
        position: relative;
        z-index: 10;
    }

    .verticalSlider_slide {
        position: relative;
        top: 0;
        transition: scale 0.4s, top 0.4s;
    }

    .verticalSlider_slide.isCurrent:not(:nth-of-type(1)) {
        position: absolute;
    }

    .verticalSlider_slide:not(.isCurrent) {
        position: absolute;
        top: calc(var(--index) * -20px);
        z-index: calc(var(--index) * -1);
        scale: calc(1 - 0.05 * var(--index));
    }

    .verticalSlider_counter {
        position: absolute;
        left: calc(100% + 16px);
        top: 50%;
        transform: translateY(-50%);
    }
</style>