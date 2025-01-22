<script lang="ts">
  import ScreenSelector from "$lib/components/screenSelector.svelte";
  import type { ScreenData } from "$lib/screens.svelte.js";
  import { enhance } from "$app/forms";

  let { data } = $props();

  let dirtyState: false | ScreenData[] = $state(false);
  let saving = $state(false);
</script>

<div class="card">
  <div class="card-body">
    <h1 class="card-title">Screen Config</h1>
    <p class="mb-4">
      Drag and drop to reorder screens. Click on a screen to edit. Screens will
      play in the scheduled order, with weighting applied for time.
    </p>
    <div
      class="card flex flex-row w-full bg-base-200 mb-4 items-center transition"
      class:bg-warning={dirtyState}
      class:text-warning-content={dirtyState}
    >
      <div class="px-4 flex items-center gap-1">
        {#if dirtyState}
          <span class="icon-[tabler--alert-square-rounded]"></span>
          <strong>Warning:</strong> You have unsaved changes.
        {:else}
          <span class="icon-[tabler--check]"></span>
          <strong>Changes Saved</strong>
        {/if}
      </div>
      <div class="grow"></div>
      <div class="flex gap-2 p-2">
        <form
          method="POST"
          use:enhance={() => {
            saving = true;
            return async ({ result, update }) => {
              // `result` is an `ActionResult` object
              // `update` is a function which triggers the default logic that would be triggered if this callback wasn't set
              // Wait 1s for propogation
              if (result.type !== "success") {
                alert("Error saving changes. Please try again.");
              }
              setTimeout(async () => {
                saving = false;
                dirtyState = false;
                await update({ invalidateAll: true });
                console.log(data.screenList);
              }, 1000);
            };
          }}
        >
          <input
            type="hidden"
            name="screenList"
            value={JSON.stringify(dirtyState)}
          />
          <button class="btn btn-gradient" disabled={!dirtyState}>
            {#if saving}
              <span class="icon-[tabler--spinner] animate-spin"></span>
              Saving
            {:else}
              Save
            {/if}
          </button>
        </form>
      </div>
      <div class="flex gap-2 p-2">
        <!-- Add new screen -->
        <a href="/admin/screen/new/" class="btn btn-primary">
          <span class="icon-[tabler--plus]"></span>
          Add Screen
        </a>
      </div>
    </div>
    {#key data.screenList}
      <ScreenSelector
        screens={data.screenList}
        update={(screens) => {
          dirtyState = screens;
        }}
      />
    {/key}
  </div>
</div>

<style lang="postcss">
</style>
