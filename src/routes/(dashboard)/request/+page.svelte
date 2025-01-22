<script lang="ts">
  import { page } from "$app/state";
  import type { ScreenData } from "$lib/screens.svelte.js";
  import MediaType from "$lib/components/mediaType.svelte";
  import Upload from "$lib/components/upload.svelte";
  import { fade, slide } from "svelte/transition";
  import { enhance } from "$app/forms";
  import EditForm from "$lib/components/editForm.svelte";
  import { onMount, tick } from "svelte";
  import { afterNavigate, goto } from "$app/navigation";
  import { browser } from "$app/environment";
  const { id } = page.params;

  let { data } = $props();

  const blankData = {
    Name: "",
    Image: undefined,
    Video: undefined,
    creator: "",
    Iframe_URL: "",
    foreground: false,
  } as ScreenData;

  let screen = $state(JSON.parse(JSON.stringify(blankData)) as ScreenData);
  afterNavigate(async (navType) => {
    console.log("Navigated");
    screen = JSON.parse(JSON.stringify(blankData)) as ScreenData;
  });

  let showAlerts = $state(false);
  onMount(() => {
    showAlerts = true;
  });

  const hideAlerts = () => {
    showAlerts = false;
    goto("/request", {
      invalidateAll: false,
      noScroll: true,
      replaceState: true,
    });
  };
</script>

<div class="card">
  {#if showAlerts && page.url.searchParams.has("success")}
    <div
      class="alert alert-success flex items-center gap-4"
      role="alert"
      transition:slide|global
    >
      <span class="icon-[tabler--circle-check] size-6"></span>
      <p>
        <span class="text-lg font-semibold">Request Submitted:</span> Thanks for
        suggesting something! If it's approved, it will appear on the display soon.
      </p>
      <button
        class="ms-auto leading-none"
        onclick={hideAlerts}
        aria-label="Close Button"
      >
        <span class="icon-[tabler--x] size-5"></span>
      </button>
    </div>
  {/if}
  {#if showAlerts && page.url.searchParams.has("error")}
    <div
      class="alert alert-error flex items-center gap-4"
      role="alert"
      transition:slide|global
    >
      <span class="icon-[tabler--circle-x] size-6"></span>
      <p>
        <span class="text-lg font-semibold">Error:</span> There was an error submitting
        your request. Please try again.
      </p>
      <button
        class="ms-auto leading-none"
        onclick={hideAlerts}
        aria-label="Close Button"
      >
        <span class="icon-[tabler--x] size-5"></span>
      </button>
    </div>
  {/if}
  <div class="card-body">
    <h1 class="card-title flex">
      <p class="grow">Add Screen</p>
    </h1>
    <!-- Edit Form -->
    <EditForm
      bind:screen
      canSetStatus={false}
      onsave={async () => {
        console.log("Navigating");
        goto(`/request?success`, {
          noScroll: false,
          keepFocus: false,
          replaceState: true,
        });
      }}
    />
  </div>
</div>
