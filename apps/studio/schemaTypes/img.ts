import { defineType } from "sanity";
import { ImageIcon } from "@sanity/icons";
import { mediaAssetSource } from "sanity-plugin-media";

export default defineType({
  name: "img",
  title: "Obraz",
  type: "image",
  icon: ImageIcon,
  options: {
    hotspot: true,
    sources: [mediaAssetSource],
    disableNew: true,
  },
  preview: {
    select: {
      media: "asset",
    },
    prepare(selection) {
      return {
        title: "Obraz",
        media: selection.media,
      };
    },
  },
});
