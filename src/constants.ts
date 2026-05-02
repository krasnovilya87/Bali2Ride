import { Bike } from "./types";

export const IDR_TO_USD = 16000;

export const BIKES: Bike[] = [
  {
    id: "1",
    name: "Honda Vario 160",
    type: "scooter",
    engineSize: "160cc",
    pricePerDay: 150000,
    image: "https://images.oto.com/motorcycle/honda/vario-160/honda-vario-160-60287.jpg",
    imagesByYear: {
      2026: "https://images.oto.com/motorcycle/honda/vario-160/honda-vario-160-60287.jpg",
      2025: "https://images.bisnis.com/posts/2022/02/02/1495818/all-new-honda-vario-160-2.jpg",
      2024: "https://images.tokopedia.net/img/cache/700/Vv7uQC/2022/2/4/8f8b3c9b-6e9f-4f8a-9e7b-c9a9d7d4f9f4.jpg",
      2023: "https://id-live-01.slatic.net/p/8a44917036a7ed9f5f5f5f5f5f5f5f5f.jpg",
      2022: "https://www.astra-honda.com/uploads/product/vario160_thumbnail_2.png"
    },
    colors: [
      { name: "Black", hex: "#1A1A1A" },
      { name: "White", hex: "#FFFFFF" },
      { name: "Red", hex: "#E31E24" }
    ],
    description: "Самый популярный скутер на Бали.",
    features: ["Keyless", "160cc"]
  },
  {
    id: "2",
    name: "Yamaha NMAX 155",
    type: "scooter",
    engineSize: "155cc",
    pricePerDay: 200000,
    image: "https://images.oto.com/motorcycle/yamaha/nmax/yamaha-nmax-12964.jpg",
    imagesByYear: {
      2026: "https://images.oto.com/motorcycle/yamaha/nmax/yamaha-nmax-12964.jpg",
      2025: "https://img.cintamobil.com/2021/01/25/7f4a5a5f-1.jpg",
      2024: "https://cdn.pergiplus.com/wp-content/uploads/2023/06/Yamaha-Nmax-155.jpg",
      2023: "https://imgx.gridoto.com/crop/0x0:0x0/700x466/photo/2022/01/03/yamaha-nmax-155-2022-model-png-20220103094833.jpg",
      2022: "https://static.republika.co.id/uploads/images/inpicture_slide/yamaha-nmax-155-warna-matte-green_220202204641-755.jpg"
    },
    colors: [
      { name: "Black", hex: "#1A1A1A" },
      { name: "White", hex: "#FFFFFF" },
      { name: "Red", hex: "#E31E24" }
    ],
    description: "Комфортный скутер для длинных поездок.",
    features: ["ABS", "Bluetooth"]
  },
  {
    id: "3",
    name: "Honda ADV 160",
    type: "adventure",
    engineSize: "160cc",
    pricePerDay: 250000,
    image: "https://images.oto.com/motorcycle/honda/adv-160/honda-adv-160-15638.jpg",
    imagesByYear: {
      2026: "https://images.oto.com/motorcycle/honda/adv-160/honda-adv-160-15638.jpg",
      2025: "https://cdn.motor1.com/images/mgl/mMPPxQ/s1/honda-adv160-2023.jpg",
      2024: "https://imgx.gridoto.com/crop/0x45:1000x822/700x466/photo/2022/07/01/adv_160_6jpg-20220701041926.jpg",
      2023: "https://www.astra-honda.com/uploads/product/adv160-thumbnail-1.png",
      2022: "https://images.prosieben.de/m/269190/1000/563/honda-adv160-2022.jpg"
    },
    colors: [
      { name: "Black", hex: "#1A1A1A" },
      { name: "White", hex: "#FFFFFF" },
      { name: "Red", hex: "#E31E24" }
    ],
    description: "Кроссовер-скутер для плохих дорог.",
    features: ["Traction Control", "ABS"]
  },
  {
    id: "4",
    name: "Honda Scoopy",
    type: "scooter",
    engineSize: "110cc",
    pricePerDay: 100000,
    image: "https://images.oto.com/motorcycle/honda/scoopy/honda-scoopy-14567.jpg",
    imagesByYear: {
      2026: "https://images.oto.com/motorcycle/honda/scoopy/honda-scoopy-14567.jpg",
      2025: "https://img.cintamobil.com/2021/01/25/6f4a5a5f-1.jpg",
      2024: "https://www.astra-honda.com/uploads/product/scoopy-pc-1.png",
      2023: "https://imgx.motorplus-online.com/crop/0x0:0x0/700x465/photo/2022/10/31/honda-scoopy-2023jpg-20221031123447.jpg",
      2022: "https://cdn.idntimes.com/content-images/community/2021/11/scoopy-2022-77c8e8e8e8e8e8e8e8e8e8e8e8e8e8e8.jpg"
    },
    colors: [
      { name: "Black", hex: "#1A1A1A" },
      { name: "White", hex: "#FFFFFF" },
      { name: "Red", hex: "#E31E24" }
    ],
    description: "Стильный и экономичный для города.",
    features: ["Retro design", "USB Charge"]
  },
  {
    id: "5",
    name: "Yamaha XMAX 250",
    type: "scooter",
    engineSize: "250cc",
    pricePerDay: 400000,
    image: "https://images.oto.com/motorcycle/yamaha/xmax/yamaha-xmax-45524.jpg",
    imagesByYear: {
      2026: "https://images.oto.com/motorcycle/yamaha/xmax/yamaha-xmax-45524.jpg",
      2025: "https://imgx.gridoto.com/crop/0x0:0x0/700x466/photo/2022/11/02/yamaha-xmax-connected-2023-idn-20221102025644.jpg",
      2024: "https://yamaha-motor.id/uploads/products/XMAX_CONNECTED_1.jpg",
      2023: "https://images.bisnis.com/posts/2022/11/02/1593981/yamaha-xmax-connected.jpg",
      2022: "https://static.republika.co.id/uploads/images/inpicture_slide/yamaha-xmax-250_220202204641-755.jpg"
    },
    colors: [
      { name: "Black", hex: "#1A1A1A" },
      { name: "White", hex: "#FFFFFF" },
      { name: "Red", hex: "#E31E24" }
    ],
    description: "Премиальный макси-скутер.",
    features: ["High power", "Large trunk"]
  },
  {
    id: "6",
    name: "Honda PCX 160",
    type: "scooter",
    engineSize: "160cc",
    pricePerDay: 220000,
    image: "https://images.oto.com/motorcycle/honda/pcx-160/honda-pcx-160-25638.jpg",
    imagesByYear: {
      2026: "https://images.oto.com/motorcycle/honda/pcx-160/honda-pcx-160-25638.jpg",
      2025: "https://cdn.motor1.com/images/mgl/mMPPxQ/s1/honda-pcx160-2023.jpg",
      2024: "https://www.astra-honda.com/uploads/product/pcx-160-pc-1.png",
      2023: "https://imgx.gridoto.com/crop/0x0:0x0/700x466/photo/2022/01/03/honda-pcx-160-2022-model-png-20220103094833.jpg",
      2022: "https://images.bisnis.com/posts/2022/02/02/1495818/all-new-honda-vario-160-2.jpg"
    },
    colors: [
      { name: "Black", hex: "#1A1A1A" },
      { name: "White", hex: "#FFFFFF" },
      { name: "Red", hex: "#E31E24" }
    ],
    description: "Плавный и комфортный городской скутер.",
    features: ["Digital Panel", "Keyless"]
  }
];
