<script lang="ts">
  import { getSRCSet, getVideoSrc, type ScreenData } from "$lib/screens.svelte";
  import Icon from "@iconify/svelte";
  import { onMount } from "svelte";
  import Dropzone from "svelte-file-dropzone";
  import getVideoId from "get-video-id";
  import Screen from "./screen.svelte";

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

  let url_input = $state("");
  let url_input_el: HTMLInputElement | undefined = $state();
  const original_video = $state.snapshot(data.Video);
  $effect(() => {
    if (!url_input || !url_input_el || !url_input_el.checkValidity()) {
      fileType = undefined;
      data.Video = original_video;
      return;
    }
    // Check to see if the URL is a vimeo or youtube video, and if so, set the video ID
    const id_data = getVideoId(url_input);
    if (
      id_data.service &&
      ["youtube", "vimeo"].includes(id_data.service) &&
      id_data.id
    ) {
      data.Video = {
        service: id_data.service as any,
        id: id_data.id,
      };
      data.content_type = "video";
    } else {
      data.Iframe_URL = url_input;
      data.content_type = "iframe";
    }
  });
</script>

<div
  class="relative rounded-box bg-base-200 text-base-content border-base-300 border-dashed border-2 shadow-inner bg-cover bg-center overflow-clip"
  style:background-image={(fileType === "image" && tempImageData) ||
  contentDetails.type === "image"
    ? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),url('${tempImageData || contentDetails.url}')`
    : undefined}
>
  <div
    class="w-full h-full object-cover absolute opacity-50 pointer-events-none"
  >
    {#if fileType}
      <Screen
        screen={{
          ...data,
          content_type: fileType,
        }}
        override_src={{
          image: tempImageData,
        }}
      />
    {/if}
  </div>
  <Dropzone
    class="w-full h-full absolute"
    on:drop={handleFilesSelect}
    on:dragenter={() => (dragging = true)}
    on:dragleave={() => (dragging = false)}
    accept={["image/*"]}
  >
    <div></div>
  </Dropzone>
  <div
    class="p-2 sm:p-8 text-center flex flex-col gap-4 z-10 relative pointer-events-none"
  >
    <div class="">
      <p class="text-balance">
        Drop an image here, or paste a link to Youtube, Vimeo, or something
        embeddable below!
      </p>
      <p class="text-xs opacity-80 font-mono">Max filesize: 10MB</p>
    </div>
    <div class="transition" class:opacity-50={dragging}>
      <div class="max-w-96 text-left mx-auto">
        <label class="label label-text" for="url"> Embed URL (Optional) </label>
        <input
          type="url"
          placeholder="Website, YouTube, Vimeo link..."
          class="input bg-opacity-30 backdrop-blur"
          class:pointer-events-auto={!dragging}
          id="url"
          bind:value={url_input}
          bind:this={url_input_el}
        />
      </div>
    </div>
  </div>
</div>
<ol></ol>
