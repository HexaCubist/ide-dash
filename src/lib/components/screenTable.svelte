<script lang="ts">
  import { enhance } from "$app/forms";
  import { getSRCSet, Status, type ScreenData } from "$lib/screens.svelte";

  let {
    screens,
    saving = $bindable(false),
  }: { screens: ScreenData[]; saving: boolean } = $props();
</script>

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
      {#each screens as screen}
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
            <span class="badge badge-soft badge-warning text-xs">Draft</span>
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
                  if (result.type === "error" || result.type === "failure") {
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
                  if (result.type === "error" || result.type === "failure") {
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
