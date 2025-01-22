<script lang="ts">
  import { page } from "$app/state";
  import type { ScreenData } from "$lib/screens.svelte.js";
  import MediaType from "$lib/components/mediaType.svelte";
  import Upload from "$lib/components/upload.svelte";
  import { fade } from "svelte/transition";
  import { enhance } from "$app/forms";
  import EditForm from "$lib/components/editForm.svelte";
  const { id } = page.params;

  let { data } = $props();

  let screen = $state({
    Name: "",
    Image: undefined,
    Video: undefined,
    Iframe_URL: "",
    foreground: false,
  } as ScreenData);
</script>

<div class="card">
  <div class="card-body">
    <h1 class="card-title flex">
      <p class="grow">Add Screen</p>
    </h1>
    <!-- Edit Form -->
    <EditForm {screen} canSetStatus={false} />
  </div>
</div>
