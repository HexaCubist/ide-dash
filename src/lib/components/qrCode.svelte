<script lang="ts">
  import { base } from "$app/paths";
  import { page } from "$app/state";
  import QRCode from "qrcode";

  const qr = QRCode.toDataURL(`${page.url.host}${base}/request`, {
    margin: 2,
    type: "image/png",
    color: {
      dark: "#FFF",
      light: "#FFF0",
    },
  });
</script>

{#await qr then src}
  <div
    class="qr-container absolute bottom-4 left-4 w-[200px] max-w-full p-0 rounded-box shadow overflow-clip bg-black bg-opacity-50 backdrop-blur-lg"
  >
    <img {src} alt="" class="w-full h-full" />
    <p class="text-center text-xs font-mono -mt-3 mb-1">
      {page.url.host}{base}/request
    </p>
  </div>
{/await}
