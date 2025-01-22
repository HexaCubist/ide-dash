<script lang="ts">
  import { getSRCSet, getVideoSrc, type ScreenData } from "$lib/screens.svelte";
  import Icon from "@iconify/svelte";
  import { onMount } from "svelte";
  import Dropzone from "svelte-file-dropzone";
  let {
    fileType = $bindable(undefined),
    fileData = $bindable(undefined),
    data = $bindable(),
  }: {
    fileType?: "image" | "video" | "iframe";
    fileData?: File;
    data: ScreenData;
  } = $props();

  const contentDetails = $derived.by(() => {
    if (fileType === "iframe") {
      return {
        type: "iframe",
        url: data.Iframe_URL,
      };
    }
    if (data.Image?.id) {
      return {
        type: "image",
        url: getSRCSet(data.Image.id).escreen,
      };
    }
    if (data.Video) {
      return {
        type: "video",
        url: getVideoSrc(data.Video),
      };
    }
    return {
      type: undefined,
      url: undefined,
    };
  }) as { type: typeof fileType; url: string | undefined };

  let tempImageData = $state(undefined) as undefined | string;
  let dragging = $state(false);

  const getTempSRC = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const res = reader.result?.toString();
        if (!res) return reject("Failed to read file");
        resolve(res);
      };
      reader.onerror = reject;
    });

  async function handleFilesSelect(
    e: CustomEvent<{ acceptedFiles: File[]; fileRejections: File[] }>
  ) {
    const { acceptedFiles, fileRejections } = e.detail;
    const file = acceptedFiles[0];
    if (!file) return;
    // Handle different types of file
    if (file.type.includes("image")) {
      const src = await getTempSRC(file);
      tempImageData = src;
      fileType = "image";
      fileData = file;
    } else if (file.type.includes("video")) {
      const src = await getTempSRC(file);
      tempImageData = src;
      fileType = "video";
      fileData = file;
    } else {
      console.error("Unsupported file type", file);
    }
  }
</script>

<div
  class="relative rounded-box bg-base-200 text-base-content border-base-300 border-dashed border-2 shadow-inner bg-cover bg-center overflow-clip"
  style:background-image={(fileType === "image" && tempImageData) ||
  contentDetails.type === "image"
    ? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),url('${tempImageData || contentDetails.url}')`
    : undefined}
>
  {#if fileType === "video" && tempImageData}
    <video
      class="w-full h-full object-cover absolute opacity-50"
      src={tempImageData}
      muted
      autoplay
      loop
    ></video>
  {/if}
  <Dropzone
    class="w-full h-full absolute"
    on:drop={handleFilesSelect}
    on:dragenter={() => (dragging = true)}
    on:dragleave={() => (dragging = false)}
    accept={["image/*", "video/*"]}
  >
    <div></div>
  </Dropzone>
  <div
    class="p-2 sm:p-8 text-center flex flex-col gap-4 z-10 relative pointer-events-none"
  >
    <div class="">
      <p class="text-balance">
        Drop an image/video here, or paste a link to something embeddable below!
      </p>
      <p class="text-xs opacity-80 font-mono">Max filesize: 10MB</p>
    </div>
    <div class="transition" class:opacity-50={dragging}>
      <div class="max-w-96 text-left mx-auto">
        <label class="label label-text" for="url"> Embed URL (Optional) </label>
        <input
          type="url"
          placeholder="Website link..."
          class="input bg-opacity-30 backdrop-blur"
          class:pointer-events-auto={!dragging}
          id="url"
          bind:value={data.Iframe_URL}
          oninput={(e) => {
            if (!e.currentTarget.checkValidity() || !e.currentTarget.value)
              return;
            fileType = "iframe";
          }}
        />
      </div>
    </div>
  </div>
</div>
<ol></ol>
