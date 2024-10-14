import testImage from "./../assets/test-image.webp";
import fluxImage from "./../assets/flux.webp";
import fluxRealismImage from "./../assets/flux-realism.webp";
import fluxAnime from "./../assets/flux-anime.webp";
import flux3DImage from "./../assets/flux-3d.webp";
import anyDarkImage from "./../assets/any-dark.webp";
import turboImage from "./../assets/turbo.webp";

export const modelsData = [
  {
    id: 1,
    title: "Flux",
    image: fluxImage,
    description:
      "A versatile AI model capable of generating general-purpose images based on a wide variety of prompts. Suitable for both abstract and realistic outputs.",
  },
  {
    id: 2,
    title: "Flux-Realism",
    image: fluxRealismImage,
    description:
      "Focuses on creating hyper-realistic images, delivering photorealistic quality with fine details. Ideal for lifelike representations.",
  },
  {
    id: 3,
    title: "Flux-Cablyai",
    image: testImage,
    description:
      "Specializes in generating artistic and surreal visuals, blending realism with abstract elements. Great for creative and unconventional outputs.",
  },
  {
    id: 4,
    title: "Flux-Anime",
    image: fluxAnime,
    description:
      "Specifically designed for anime-style art, capable of generating characters, scenes, and backgrounds with a Japanese anime aesthetic.",
  },
  {
    id: 5,
    title: "Flux-3D",
    image: flux3DImage,
    description:
      "Generates 3D-like visuals, perfect for creating immersive scenes with depth, shadows, and realism often found in CG renders.",
  },
  {
    id: 6,
    title: "Any-Dark",
    image: anyDarkImage,
    description:
      "Focuses on dark-themed or moody images, often suited for generating night scenes, horror visuals, or dystopian atmospheres.",
  },
  {
    id: 7,
    title: "Flux-Pro",
    image: testImage,
    description:
      "A premium model offering enhanced detail and complexity, capable of producing high-resolution, professional-grade visuals.",
  },
  {
    id: 8,
    title: "Turbo",
    image: turboImage,
    description:
      "A fast model optimized for speed, generating quick, low-latency images with slightly lower fidelity but faster response time.",
  },
];
