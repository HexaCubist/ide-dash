<script lang="ts">
  import ScreenSelector from "$lib/components/screenSelector.svelte";
  import { getSRCSet, Status, type ScreenData } from "$lib/screens.svelte.js";
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
          action="?/save"
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
                console.log(data.allScreens);
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
              <span class="icon-[tabler--reload] animate-spin"></span>
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
    <h2>New Requests</h2>
    <div class="w-full overflow-x-auto">
      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Content</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each data.allScreens.filter((screen) => screen.status === Status.Draft) as screen}
            <tr>
              <td class="text-nowrap">{screen.Name}</td>
              <td>
                {#if screen.content_type === "image" && screen.Image}
                  <a href={getSRCSet(screen.Image.id).original} target="_blank">
                    <img
                      src={getSRCSet(screen.Image.id).thumbnail}
                      alt={screen.Name}
                      class="w-full min-w-8 max-w-16 h-8 rounded-full object-cover"
                    />
                  </a>
                {:else}
                  <a
                    href="/admin/screen/{screen.id}/"
                    class="btn btn-circle btn-text btn-sm"
                    aria-label="Edit"
                    target="_blank"
                  >
                    <span class="icon-[tabler--file-type-html] size-5"></span>
                  </a>
                {/if}
              </td>
              <td>
                <span class="badge badge-soft badge-warning text-xs">Draft</span
                >
              </td>
              <td>
                <a
                  href="/admin/screen/{screen.id}/"
                  class="btn btn-circle btn-text btn-sm"
                  aria-label="Edit"
                  class:btn-disabled={saving}
                >
                  <span class="icon-[tabler--pencil] size-5"></span>
                </a>
                <form
                  class="contents"
                  method="POST"
                  action="?/delete"
                  use:enhance={() => {
                    return async ({ result, update }) => {
                      saving = true;
                      if (
                        result.type === "error" ||
                        result.type === "failure"
                      ) {
                        alert("Error saving changes. Please try again.");
                      }
                      setTimeout(async () => {
                        await update({ invalidateAll: true });
                        saving = false;
                      }, 300);
                    };
                  }}
                >
                  <input type="hidden" name="id" value={screen.id} />
                  <button
                    class="btn btn-circle btn-text btn-sm"
                    aria-label="Delete"
                    type="submit"
                    disabled={saving}
                  >
                    <span class="icon-[tabler--trash] size-5"></span>
                  </button>
                </form>
                <form
                  class="contents"
                  method="POST"
                  action="?/publish"
                  use:enhance={() => {
                    return async ({ result, update }) => {
                      saving = true;
                      if (
                        result.type === "error" ||
                        result.type === "failure"
                      ) {
                        alert("Error saving changes. Please try again.");
                      }
                      setTimeout(async () => {
                        await update({ invalidateAll: true });
                        saving = false;
                      }, 300);
                    };
                  }}
                >
                  <input type="hidden" name="id" value={screen.id} />
                  <button
                    class="btn btn-circle btn-text btn-sm"
                    aria-label="Approve"
                    type="submit"
                    disabled={saving}
                  >
                    <span class="icon-[tabler--check] size-5"></span>
                  </button>
                </form>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
    <h2 class="my-4">Published Screens</h2>
    {#key data.allScreens}
      <ScreenSelector
        screens={data.allScreens.filter(
          (screen) => screen.status === Status.Published
        )}
        update={(screens) => {
          dirtyState = screens;
        }}
      />
    {/key}
  </div>
</div>

<style lang="postcss">
  h2 {
    @apply font-bold text-xl;
  }
</style>
