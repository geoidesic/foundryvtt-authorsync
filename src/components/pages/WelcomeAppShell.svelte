<script>
  import { onMount, getContext } from "svelte";
  import { ApplicationShell }   from '#runtime/svelte/component/application';
  import { localize as t } from "~/src/helpers/utility";
  import { MODULE_ID, MODULE_TITLE } from "~/src/helpers/constants";

  export let elementRoot = void 0;
  export let version = void 0;

  const application = getContext('#external').application;

  const handleChange = (event) => {
    game.settings.set(MODULE_ID, 'dontShowWelcome', event.target.checked);
  }

  let draggable = application.reactive.draggable;
  draggable = true;

  $: application.reactive.draggable = draggable;
  $: dontShowWelcome = game.settings.get(MODULE_ID, 'dontShowWelcome');

  onMount(async () => {
  });
</script>

<svelte:options accessors={true}/>

<template lang="pug">
  ApplicationShell(bind:elementRoot)
    main
      h3 AuthorSync Integration
      p This module adds an AuthorSync export action directly to the Foundry Journal sheet.
      p Use the button in the Journal header to export the current JournalEntry as a ZIP bundle for AuthorSync.
      p The welcome panel is informational only and no longer contains export controls.

      footer
        div.logo
          a(href="https://www.aardvark.games")
            img.white(src!="/modules/{MODULE_ID}/assets/aardvark-logo.webp" alt="Aardvark Game Studios Logo" height="50" width="50" style="fill: white; border: none; width: auto;")
        div.left
          div {t("Title")} {t("Welcome.CreatedBy")}
          a(href="https://www.aardvark.games") Aardvark Game Studios
    footer
      p {MODULE_TITLE} is sponsored by
      a(href="https://www.round-table.games") Round Table Games
</template>

<style lang="sass">
  @import "../../styles/Mixins.sass"

  main
    overflow-y: auto
    padding: 1rem

    h3
      margin-top: 0

    p
      margin: 0.75rem 0

  footer
    border-top: 8px ridge var(--border-shadow)
    display: grid
    grid-template-columns: 2fr 4fr
    position: fixed
    bottom: 0
    align-items: center
    gap: 1em
    line-height: 2em
    left: 0
    right: 0
    background-color: #333
    color: white
    padding: 1em
    font-size: 0.8em
    z-index: 3

    div.logo
      a
        display: flex
        align-items: center
        justify-content: end
        gap: 0.5em

    a
      color: white
      text-decoration: underline
      &:hover
        color: #ccc
</style>