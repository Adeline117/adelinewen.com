// Event photo strips, one per honour. Generated from the owner's event folders:
// every image is 720px tall, metadata-stripped; live = the Live Photo's motion
// (muted mp4, same frame as its still).
export type Shot = { src: string; w: number; h: number; live?: string };

export const GALLERY = {
  informs: [
    { src: "/photos/informs/01.jpg", w: 960, h: 720 },
    { src: "/photos/informs/02.jpg", w: 540, h: 720, live: "/photos/informs/02.mp4" },
    { src: "/photos/informs/03.jpg", w: 540, h: 720 },
    { src: "/photos/informs/04.jpg", w: 529, h: 720 },
    { src: "/photos/informs/05.jpg", w: 958, h: 720 },
    { src: "/photos/informs/06.jpg", w: 560, h: 720 },
  ],
  smc: [
    { src: "/photos/smc/01.jpg", w: 960, h: 720, live: "/photos/smc/01.mp4" },
    { src: "/photos/smc/02.jpg", w: 440, h: 720, live: "/photos/smc/02.mp4" },
    { src: "/photos/smc/03.jpg", w: 540, h: 720, live: "/photos/smc/03.mp4" },
    { src: "/photos/smc/04.jpg", w: 540, h: 720, live: "/photos/smc/04.mp4" },
    { src: "/photos/smc/05.jpg", w: 540, h: 720, live: "/photos/smc/05.mp4" },
  ],
  nbc: [
    { src: "/photos/nbc/01.jpg", w: 1080, h: 720 },
    { src: "/photos/nbc/02.jpg", w: 540, h: 720 },
    { src: "/photos/nbc/03.jpg", w: 1080, h: 720 },
    { src: "/photos/nbc/04.jpg", w: 1080, h: 720 },
    { src: "/photos/nbc/05.jpg", w: 1080, h: 720 },
    { src: "/photos/nbc/06.jpg", w: 1080, h: 720 },
    { src: "/photos/nbc/07.jpg", w: 1080, h: 720 },
    { src: "/photos/nbc/08.jpg", w: 1080, h: 720 },
    { src: "/photos/nbc/09.jpg", w: 1080, h: 720 },
    { src: "/photos/nbc/10.jpg", w: 1080, h: 720 },
    { src: "/photos/nbc/11.jpg", w: 1080, h: 720 },
    { src: "/photos/nbc/12.jpg", w: 532, h: 720 },
  ],
  paradigm: [
    { src: "/photos/paradigm/01.jpg", w: 540, h: 720 },
    { src: "/photos/paradigm/02.jpg", w: 540, h: 720 },
    { src: "/photos/paradigm/03.jpg", w: 552, h: 720, live: "/photos/paradigm/03.mp4" },
    { src: "/photos/paradigm/04.jpg", w: 540, h: 720 },
    { src: "/photos/paradigm/05.jpg", w: 477, h: 720 },
    { src: "/photos/paradigm/06.jpg", w: 540, h: 720 },
    { src: "/photos/paradigm/07.jpg", w: 540, h: 720 },
    { src: "/photos/paradigm/08.jpg", w: 540, h: 720 },
  ],
  yc: [
    { src: "/photos/yc/01.jpg", w: 469, h: 720 },
    { src: "/photos/yc/02.jpg", w: 540, h: 720 },
    { src: "/photos/yc/03.jpg", w: 540, h: 720, live: "/photos/yc/03.mp4" },
    { src: "/photos/yc/04.jpg", w: 540, h: 720, live: "/photos/yc/04.mp4" },
    { src: "/photos/yc/05.jpg", w: 540, h: 720, live: "/photos/yc/05.mp4" },
  ],
  dempsey: [
    { src: "/photos/dempsey/01.jpg", w: 1134, h: 720 },
    { src: "/photos/dempsey/02.jpg", w: 1053, h: 720 },
    { src: "/photos/dempsey/03.jpg", w: 960, h: 720 },
    { src: "/photos/dempsey/04.jpg", w: 557, h: 720 },
  ],
} satisfies Record<string, Shot[]>;
