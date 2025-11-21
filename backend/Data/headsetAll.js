const headsetAll = [
  {
    id: 1,
    brand: "Sony",
    name: "Sony WH-1000XM4",
    type: "Over-Ear Headphones",
    originalPrice: 20000,
    discountedPrice: 16000,
    rating: 4,
    discount: 20,
    images: [
      "/Headset/sony1 (1).jpg",
      "/Headset/sony1 (2).jpg",
      "/Headset/sony1 (3).jpg",
      "/Headset/sony1 (4).jpg",
      "/Headset/sony1 (5).jpg",
    ],
    colorOptions: [
      {
        id: "Black",
        name: "Midnight Black",
      },
      {
        id: "Silver",
        name: "Platinum Silver",
      },
      {
        id: "Blue",
        name: "Silent White",
      },
    ],
    modelOptions: [
      {
        model: "WH-1000XM4 Standard",
        price: 16000,
      },
      {
        model: "WH-1000XM4 Limited Edition",
        price: 17000,
      },
      {
        model: "WH-1000XM4 with Premium Case",
        price: 18000,
      },
      {
        model: "WH-1000XM4 with Extended Warranty",
        price: 20000,
      },
    ],
    features: ["Noise Cancelling", "High Bass", "Over-Ear"],
    specifications: {
      brand: "Sony",
      model: "WH-1000XM4",
      type: "Over-Ear",
      defaultColor: "Black",
      batteryLife: "Up to 30 hours",
      connection: "Bluetooth 5.0",
      waterResistance: "Not specified",
      warranty: "1 Year",
    },
    aboutItem: [
      "Industry-leading noise canceling technology for immersive listening",
      "30-hour battery life with quick charge (10 min = 5 hours)",
      "Touch Sensor controls to pause, play, skip tracks, and adjust volume",
      "Speak-to-chat technology automatically reduces volume during conversations",
      "Superior call quality with precise voice pickup technology",
      "Wearing detection pauses playback when headphones are removed",
    ],
    description:
      "Premium wireless noise-canceling headphones with industry-leading technology, exceptional sound quality, and all-day battery life.",
    inStock: true,
    freeDelivery: true,
    deliveryTime: "2-3 business days",
    returnPolicy: "7-day return policy",
    reviewCount: 1847,
  },
  {
    id: 2,
    brand: "JBL",
    name: "JBL Quantum 200",
    type: "Gaming Headset",
    originalPrice: 15000,
    discountedPrice: 12750,
    rating: 3,
    discount: 15,
    images: [
      "/Headset/jbl1 (1).jpg",
      "/Headset/jbl1 (2).jpg",
      "/Headset/jbl1 (3).jpg",
      "/Headset/jbl1 (4).jpg",
      "/Headset/jbl1 (5).jpg",
    ],
    colorOptions: [
      {
        id: "Black",
        name: "Classic Black",
      },
      {
        id: "White",
        name: "Arctic White",
      },
      {
        id: "Blue",
        name: "Electric Blue",
      },
    ],
    modelOptions: [
      {
        model: "Quantum 200 Standard",
        price: 12750,
      },
      {
        model: "Quantum 200 with Extended Cable",
        price: 13000,
      },
      {
        model: "Quantum 200 Bundle Pack",
        price: 13500,
      },
      {
        model: "Quantum 200 Pro Edition",
        price: 14000,
      },
    ],
    features: ["Deep Bass", "Comfortable Fit", "Gaming Optimized"],
    specifications: {
      brand: "JBL",
      model: "Quantum 200",
      type: "Over-Ear Gaming",
      defaultColor: "Black",
      batteryLife: "N/A (Wired)",
      connection: "3.5mm Wired",
      waterResistance: "Not applicable",
      warranty: "1 Year",
    },
    aboutItem: [
      "JBL QuantumSOUND Signature delivers competitive advantage in gaming",
      "Lightweight design with memory foam ear cushions for extended comfort",
      "Detachable boom microphone with echo cancelling technology",
      "Compatible with PC, Mac, Xbox, PlayStation, Nintendo Switch, and mobile devices",
      "Durable construction built for intense gaming sessions",
      "Precise audio positioning to hear enemies before they hear you",
    ],
    description:
      "Wired gaming headset engineered with JBL QuantumSOUND Signature for immersive gaming audio and all-day comfort.",
    inStock: true,
    freeDelivery: true,
    deliveryTime: "1-2 business days",
    returnPolicy: "7-day return policy",
    reviewCount: 1243,
  },
  {
    id: 3,
    brand: "Bose",
    name: "Bose 700",
    type: "Noise Cancelling Headphones",
    originalPrice: 25000,
    discountedPrice: 18750,
    rating: 5,
    discount: 25,
    images: [
      "./Headset/Bose1 (1).jpg",
      "./Headset/Bose1 (2).jpg",
      "./Headset/Bose1 (3).jpg",
      "./Headset/Bose1 (4).jpg",
      "./Headset/Bose1 (5).jpg",
    ],
    colorOptions: [
      {
        id: "Black",
        name: "Luxe Black",
      },
      {
        id: "Silver",
        name: "Luxe Silver",
      },
      {
        id: "White",
        name: "Soapstone White",
      },
    ],
    modelOptions: [
      {
        model: "Bose 700 Standard",
        price: 18750,
      },
      {
        model: "Bose 700 with Travel Case",
        price: 19500,
      },
      {
        model: "Bose 700 Bundle Pack",
        price: 20000,
      },
      {
        model: "Bose 700 UC Edition",
        price: 23000,
      },
    ],
    features: ["Noise Cancelling", "Lightweight", "Long Battery Life"],
    specifications: {
      brand: "Bose",
      model: "700",
      type: "Over-Ear Noise Cancelling",
      defaultColor: "Black",
      batteryLife: "20 hours",
      connection: "Bluetooth and Wired",
      waterResistance: "Not applicable",
      warranty: "1 Year",
    },
    aboutItem: [
      "Revolutionary noise cancelling technology with 11 levels of active noise cancelling",
      "Lightweight stainless steel headband and comfortable ear cushions for all-day wear",
      "Crystal clear calls with adaptive four-microphone system",
      "Touch controls for music, calls, and voice assistants",
      "Premium materials and sophisticated design",
      "Compatible with Alexa and Google Assistant built-in",
    ],
    description:
      "Premium wireless noise cancelling headphones with revolutionary technology, exceptional audio quality, and sophisticated design for music and calls.",
    inStock: true,
    freeDelivery: true,
    deliveryTime: "1-2 business days",
    returnPolicy: "7-day return policy",
    reviewCount: 2847,
  },
  {
    id: 4,
    brand: "Sennheiser",
    name: "Sennheiser HD 280 Pro",
    type: "Professional Studio Headphones",
    originalPrice: 18000, // Calculated from price / (1 - discount/100)
    discountedPrice: 14760,
    rating: 4,
    discount: 18,
    images: [
      "/Headset/Sennheiser1 (1).jpg",
      "/Headset/Sennheiser1 (2).jpg",
      "/Headset/Sennheiser1 (3).jpg",
      "/Headset/Sennheiser1 (4).jpg",
      "/Headset/Sennheiser1 (5).jpg",
      "/Headset/Sennheiser1 (6).jpg",
    ],
    colorOptions: [
      {
        id: "Black",
        name: "Professional Black",
      },
      {
        id: "Silver",
        name: "Studio Silver",
      },
    ],
    modelOptions: [
      {
        model: "HD 280 Pro Standard",
        price: 14760,
      },
      {
        model: "HD 280 Pro with Extended Cable",
        price: 15000,
      },
      {
        model: "HD 280 Pro Studio Bundle",
        price: 15500,
      },
      {
        model: "HD 280 Pro Deluxe Edition",
        price: 16000,
      },
    ],
    features: ["Balanced Sound", "Durable Design"],
    specifications: {
      brand: "Sennheiser",
      model: "HD 280 Pro",
      type: "Closed-Back Studio",
      defaultColor: "Black",
      batteryLife: "N/A (Wired)",
      connection: "Wired",
      waterResistance: "Not applicable",
      warranty: "2 Years",
    },
    aboutItem: [
      "Professional closed-back headphones designed for studio monitoring",
      "Excellent sound isolation with up to 32 dB ambient noise attenuation",
      "Accurate, linear sound reproduction for critical listening",
      "Robust construction built to withstand professional use",
      "Comfortable padded headband and ear cushions for extended sessions",
      "Coiled cable with 1/4 inch adapter included for studio compatibility",
    ],
    description:
      "Professional studio monitoring headphones delivering accurate sound reproduction and excellent isolation for recording, mixing, and critical listening applications.",
    inStock: true,
    freeDelivery: true,
    deliveryTime: "1-2 business days",
    returnPolicy: "7-day return policy",
    reviewCount: 1654,
  },
  {
    id: 5,
    brand: "Audio-Technica",
    name: "Audio-Technica ATH-M50xBT",
    type: "Wireless Studio Headphones",
    originalPrice: 22000, // Calculated from price / (1 - discount/100)
    discountedPrice: 17600,
    rating: 5,
    discount: 20,
    images: [
      "/Headset/Technica1 (1).jpg",
      "/Headset/Technica1 (2).jpg",
      "/Headset/Technica1 (3).jpg",
      "/Headset/Technica1 (4).jpg",
      "/Headset/Technica1 (5).jpg",
    ],
    colorOptions: [
      {
        id: "Black",
        name: "Studio Black",
      },
      {
        id: "Blue",
        name: "Navy Blue",
      },
      {
        id: "Brown",
        name: "Brown Limited Edition",
      },
    ],
    modelOptions: [
      {
        model: "ATH-M50xBT Standard",
        price: 17600,
      },
      {
        model: "ATH-M50xBT with Case",
        price: 18000,
      },
      {
        model: "ATH-M50xBT Studio Bundle",
        price: 18500,
      },
      {
        model: "ATH-M50xBT2 (Latest Gen)",
        price: 20000,
      },
    ],
    features: ["Studio Quality", "Wireless Freedom"],
    specifications: {
      brand: "Audio-Technica",
      model: "ATH-M50xBT",
      type: "Closed-Back Wireless Studio",
      defaultColor: "Black",
      batteryLife: "40 hours",
      connection: "Bluetooth",
      waterResistance: "Not applicable",
      warranty: "1 Year",
    },
    aboutItem: [
      "Wireless version of the legendary ATH-M50x professional studio headphones",
      "Exceptional 40-hour battery life with quick charge capability",
      "Premium audio quality with 45mm large-aperture drivers",
      "Multipoint pairing capability to connect two devices simultaneously",
      "Professional-grade ear pad and headband material for long-term durability",
      "Touch sensor controls for intuitive operation of music and calls",
    ],
    description:
      "Professional wireless studio headphones combining the acclaimed sound signature of the ATH-M50x with the convenience of Bluetooth connectivity and exceptional battery life.",
    inStock: true,
    freeDelivery: true,
    deliveryTime: "1-2 business days",
    returnPolicy: "7-day return policy",
    reviewCount: 3421,
  },
  {
    id: 6,
    brand: "Sony",
    name: "Sony WH-1000XM5",
    type: "Premium Noise Cancelling Headphones",
    originalPrice: 30000, // Calculated from price / (1 - discount/100)
    discountedPrice: 23400,
    rating: 5,
    discount: 22,
    images: [
      "/Headset/sony2 (1).jpg",
      "/Headset/sony2 (2).jpg",
      "/Headset/sony2 (3).jpg",
      "/Headset/sony2 (4).jpg",
      "/Headset/sony2 (5).jpg",
    ],
    colorOptions: [
      {
        id: "Black",
        name: "Midnight Black",
      },
      {
        id: "Silver",
        name: "Platinum Silver",
      },
      {
        id: "Blue",
        name: "Deep Ocean Blue",
      },
    ],
    modelOptions: [
      {
        model: "WH-1000XM5 Standard",
        price: 23400,
      },
      {
        model: "WH-1000XM5 with Travel Case",
        price: 23800,
      },
      {
        model: "WH-1000XM5 Premium Bundle",
        price: 24000,
      },
      {
        model: "WH-1000XM5 Limited Edition",
        price: 25000,
      },
    ],
    features: ["Noise Cancelling", "High-Resolution Audio"],
    specifications: {
      brand: "Sony",
      model: "WH-1000XM5",
      type: "Over-Ear Wireless Noise Cancelling",
      defaultColor: "Black",
      batteryLife: "30 hours",
      connection: "Bluetooth",
      waterResistance: "Not applicable",
      warranty: "1 Year",
    },
    aboutItem: [
      "Industry-leading noise cancelling with new Auto NC Optimizer technology",
      "Magnificent sound quality with 30mm precision-engineered drivers",
      "Crystal clear hands-free calling with precise voice pickup technology",
      "Up to 30 hours of battery life with quick charge (3 min = 3 hours)",
      "Multipoint connection allows pairing with two Bluetooth devices simultaneously",
      "Speak-to-Chat technology automatically pauses music when you start speaking",
    ],
    description:
      "Premium wireless noise cancelling headphones with industry-leading technology, exceptional sound quality, and intelligent features for the ultimate listening experience.",
    inStock: true,
    freeDelivery: true,
    deliveryTime: "1-2 business days",
    returnPolicy: "7-day return policy",
    reviewCount: 4892,
  },
  {
    id: 7,
    brand: "JBL",
    name: "JBL Tune 500BT",
    type: "Wireless On-Ear Headphones",
    originalPrice: 13000, // Calculated from price / (1 - discount/100)
    discountedPrice: 11700,
    rating: 3,
    discount: 10,
    images: [
      "/Headset/jbl2 (1).jpg",
      "/Headset/jbl2 (2).jpg",
      "/Headset/jbl2 (3).jpg",
      "/Headset/jbl2 (4).jpg",
      "/Headset/jbl2 (5).jpg",
    ],
    colorOptions: [
      {
        id: "Black",
        name: "Pure Bass Black",
      },
      {
        id: "Blue",
        name: "Ocean Blue",
      },
      {
        id: "White",
        name: "Pure White",
      },
      {
        id: "Pink",
        name: "Rose Pink",
      },
    ],
    modelOptions: [
      {
        model: "Tune 500BT Standard",
        price: 11700,
      },
      {
        model: "Tune 500BT with Carry Pouch",
        price: 12000,
      },
      {
        model: "Tune 500BT Dual Pack",
        price: 13000,
      },
      {
        model: "Tune 510BT (Upgraded Model)",
        price: 15500,
      },
    ],
    features: ["Bass Boost", "Lightweight"],
    specifications: {
      brand: "JBL",
      model: "Tune 500BT",
      type: "On-Ear Wireless",
      defaultColor: "Black",
      batteryLife: "16 hours",
      connection: "Bluetooth",
      waterResistance: "Not applicable",
      warranty: "1 Year",
    },
    aboutItem: [
      "JBL Pure Bass sound delivers powerful and clear audio experience",
      "Lightweight and comfortable on-ear design for all-day listening",
      "Up to 16 hours of wireless playback on a single charge",
      "Quick 2-hour charging time for maximum convenience",
      "Hands-free calls and voice assistant access with built-in microphone",
      "Foldable design makes them perfect for travel and storage",
    ],
    description:
      "Affordable wireless on-ear headphones featuring JBL's signature Pure Bass sound in a lightweight, comfortable design perfect for everyday listening.",
    inStock: true,
    freeDelivery: true,
    deliveryTime: "1-2 business days",
    returnPolicy: "7-day return policy",
    reviewCount: 2156,
  },
  {
    id: 8,
    brand: "Bose",
    name: "Bose QuietComfort 35 II",
    type: "Wireless Noise Cancelling Headphones",
    originalPrice: 27000, // Calculated from price / (1 - discount/100)
    discountedPrice: 21600,
    rating: 5,
    discount: 20,
    images: [
      "/Headset/Bose2 (1).jpg",
      "/Headset/Bose2 (2).jpg",
      "/Headset/Bose2 (3).jpg",
      "/Headset/Bose2 (4).jpg",
    ],
    colorOptions: [
      {
        id: "Black",
        name: "Triple Black",
      },
      {
        id: "Silver",
        name: "Silver",
      },
      {
        id: "RoseGold",
        name: "Rose Gold Limited Edition",
      },
    ],
    modelOptions: [
      {
        model: "QuietComfort 35 II Standard",
        price: 21600,
      },
      {
        model: "QuietComfort 35 II with Travel Kit",
        price: 22000,
      },
      {
        model: "QuietComfort 35 II Gaming Bundle",
        price: 23000,
      },
      {
        model: "QuietComfort 45 (Latest Model)",
        price: 24000,
      },
    ],
    features: ["Noise Cancelling", "Clear Call Quality"],
    specifications: {
      brand: "Bose",
      model: "QuietComfort 35 II",
      type: "Over-Ear Wireless Noise Cancelling",
      defaultColor: "Black",
      batteryLife: "20 hours",
      connection: "Bluetooth",
      waterResistance: "Not applicable",
      warranty: "1 Year",
    },
    aboutItem: [
      "World-class noise cancelling technology with Acoustic Noise Cancelling",
      "Google Assistant and Amazon Alexa built-in for voice control",
      "Balanced audio performance at any volume with TriPort acoustic architecture",
      "Up to 20 hours of wireless battery life for all-day listening",
      "Dual-microphone system for clear calls even in noisy environments",
      "Lightweight materials and plush ear cushions for maximum comfort",
    ],
    description:
      "Legendary wireless noise cancelling headphones with world-class technology, voice assistant integration, and premium comfort for the ultimate listening experience.",
    inStock: true,
    freeDelivery: true,
    deliveryTime: "1-2 business days",
    returnPolicy: "7-day return policy",
    reviewCount: 5674,
  },
  // Sennheiser PXC 550-II
  {
    id: 9,
    brand: "Sennheiser",
    name: "Sennheiser PXC 550-II",
    type: "Wireless Noise Cancelling Headphones",
    originalPrice: 20000, // Calculated from price / (1 - discount/100)
    discountedPrice: 17000,
    rating: 4,
    discount: 15,
    images: [
      "/Headset/sen2 (1).jpg",
      "/Headset/sen2 (2).jpg",
      "/Headset/sen2 (3).jpg",
      "/Headset/sen2 (4).jpg",
      "/Headset/sen2 (5).jpg",
    ],
    colorOptions: [
      {
        id: "Black",
        name: "Matte Black",
      },
      {
        id: "White",
        name: "Ivory White",
      },
    ],
    modelOptions: [
      {
        model: "PXC 550-II Standard",
        price: 17000,
      },
      {
        model: "PXC 550-II with Travel Case",
        price: 18000,
      },
      {
        model: "PXC 550-II Business Bundle",
        price: 19000,
      },
      {
        model: "PXC 550-II Wireless (Latest)",
        price: 20000,
      },
    ],
    features: ["Noise Cancelling", "Comfortable Fit"],
    specifications: {
      brand: "Sennheiser",
      model: "PXC 550-II",
      type: "Over-Ear Wireless Noise Cancelling",
      defaultColor: "Black",
      batteryLife: "20 hours",
      connection: "Bluetooth and Wired",
      waterResistance: "Not applicable",
      warranty: "2 Years",
    },
    aboutItem: [
      "Adaptive noise cancellation with three modes for different environments",
      "Exceptional audio quality with Sennheiser's signature sound",
      "Smart pause feature automatically pauses music when headphones are removed",
      "Touch controls for easy music and call management",
      "Comfortable fit with memory foam ear pads for extended listening",
      "Foldable design with premium materials for travel convenience",
    ],
    description:
      "Premium wireless noise cancelling headphones combining Sennheiser's legendary audio quality with intelligent features and exceptional comfort.",
    inStock: true,
    freeDelivery: true,
    deliveryTime: "1-2 business days",
    returnPolicy: "7-day return policy",
    reviewCount: 1892,
  },
  {
    id: 10,
    brand: "Audio-Technica",
    name: "Audio-Technica ATH-M40x",
    type: "Professional Studio Monitor Headphones",
    originalPrice: 25000, // Calculated from price / (1 - discount/100)
    discountedPrice: 20500,
    rating: 5,
    discount: 18,
    images: [
      "/image/head10.jpg",
      "/Headset/Technica2 (2).jpg",
      "/Headset/Technica2 (1).jpg",
      "/Headset/Technica2 (3).jpg",
      "/Headset/Technica2 (4).jpg",
      "/Headset/Technica2 (5).jpg",
    ],
    colorOptions: [
      {
        id: "Black",
        name: "Professional Black",
      },
      {
        id: "Blue",
        name: "Limited Blue Edition",
      },
    ],
    modelOptions: [
      {
        model: "ATH-M40x Standard",
        price: 20500,
      },
      {
        model: "ATH-M40x with Extra Cables",
        price: 21000,
      },
      {
        model: "ATH-M40x Studio Pack",
        price: 22000,
      },
      {
        model: "ATH-M50x (Upgraded Model)",
        price: 23000,
      },
    ],
    features: ["Studio Quality", "Detachable Cable"],
    specifications: {
      brand: "Audio-Technica",
      model: "ATH-M40x",
      type: "Closed-Back Studio Monitor",
      defaultColor: "Black",
      batteryLife: "N/A (Wired)",
      connection: "Wired",
      waterResistance: "Not applicable",
      warranty: "1 Year",
    },
    aboutItem: [
      "Professional studio monitor headphones with exceptional clarity",
      "40mm drivers tuned for enhanced detail across extended frequency range",
      "Circumaural design contours around ears for excellent sound isolation",
      "Detachable cables with straight and coiled options included",
      "Swiveling earcups for easy one-ear monitoring",
      "Professional-grade materials built for studio durability",
    ],
    description:
      "Professional studio monitor headphones delivering exceptional clarity and detail for critical listening, mixing, and mastering applications.",
    inStock: true,
    freeDelivery: true,
    deliveryTime: "1-2 business days",
    returnPolicy: "7-day return policy",
    reviewCount: 2764,
  },

  {
    id: 11,
    brand: "Sony",
    name: "Sony MDR-7506",
    type: "Professional Studio Headphones",
    originalPrice: 16000, // Calculated from price / (1 - discount/100)
    discountedPrice: 14080,
    rating: 4,
    discount: 12,
    images: [
      "/image/head11.jpg",
      "/Headset/Sony3 (1).jpg",
      "/Headset/Sony3 (2).jpg",
      "/Headset/Sony3 (3).jpg",
      "/Headset/Sony3 (4).jpg",
      "/Headset/Sony3 (5).jpg",
    ],
    colorOptions: [
      {
        id: "Black",
        name: "Classic Black",
      },
    ],
    modelOptions: [
      {
        model: "MDR-7506 Standard",
        price: 14000,
      },
      {
        model: "MDR-7506 with Carrying Case",
        price: 15500,
      },
      {
        model: "MDR-7506 Professional Bundle",
        price: 16000,
      },
      {
        model: "MDR-V6 (Vintage Model)",
        price: 18500,
      },
    ],
    features: ["Balanced Sound", "Comfortable Design"],
    specifications: {
      brand: "Sony",
      model: "MDR-7506",
      type: "Closed-Back Professional",
      defaultColor: "Black",
      batteryLife: "N/A (Wired)",
      connection: "Wired",
      waterResistance: "Not applicable",
      warranty: "1 Year",
    },
    aboutItem: [
      "Industry standard headphones used in professional studios worldwide",
      "Precise sound reproduction with extended frequency response",
      "Closed-ear design provides comfort and outstanding reduction of external noise",
      "Rugged construction with reinforced stress points for long-lasting durability",
      "Neodymium magnets and 40mm drivers deliver powerful, detailed sound",
      "Foldable design with protective carrying pouch included",
    ],
    description:
      "Industry-standard professional headphones trusted by audio engineers and musicians worldwide for accurate monitoring and mixing.",
    inStock: true,
    freeDelivery: true,
    deliveryTime: "1-2 business days",
    returnPolicy: "7-day return policy",
    reviewCount: 4521,
  },

  {
    id: 12,
    brand: "JBL",
    name: "JBL Live 500BT",
    type: "Wireless Over-Ear Headphones",
    originalPrice: 17000, // Calculated from price / (1 - discount/100)
    discountedPrice: 14620,
    rating: 4,
    discount: 14,
    images: [
      "/Headset/Jbl3 (2).jpg",
      "/Headset/Jbl3 (1).jpg",
      "/Headset/Jbl3 (3).jpg",
      "/Headset/Jbl3 (4).jpg",
      // "/image/Headset/Jbl3 (5).jpg",
    ],
    colorOptions: [
      {
        id: "Black",
        name: "Signature Black",
      },
      {
        id: "Blue",
        name: "Electric Blue",
      },
      {
        id: "Red",
        name: "Fiesta Red",
      },
      {
        id: "White",
        name: "Cloud White",
      },
    ],
    modelOptions: [
      {
        model: "Live 500BT Standard",
        price: 14620,
      },
      {
        model: "Live 500BT with Carrying Case",
        price: 15500,
      },
      {
        model: "Live 500BT Dual Pack",
        price: 19000,
      },
      {
        model: "Live 650BTNC (Upgraded with ANC)",
        price: 22000,
      },
    ],
    features: ["Deep Bass", "Long Battery Life"],
    specifications: {
      brand: "JBL",
      model: "Live 500BT",
      type: "Over-Ear Wireless",
      defaultColor: "Black",
      batteryLife: "33 hours",
      connection: "Bluetooth",
      waterResistance: "Not applicable",
      warranty: "1 Year",
    },
    aboutItem: [
      "JBL Signature Sound with powerful 50mm drivers for deep bass",
      "Impressive 33-hour battery life for extended listening sessions",
      "Multi-point connection to seamlessly switch between devices",
      "Hands-free calls with built-in microphone and voice assistant support",
      "Comfortable over-ear design with soft padded headband",
      "Quick charge feature provides 2 hours of playback with 15-minute charge",
    ],
    description:
      "Wireless over-ear headphones delivering JBL's signature deep bass sound with exceptional battery life and comfortable design for all-day listening.",
    inStock: true,
    freeDelivery: true,
    deliveryTime: "1-2 business days",
    returnPolicy: "7-day return policy",
    reviewCount: 3287,
  },
  
];

module.exports = headsetAll;