/* Daftar produk GenStyle. Produk terbaru taruh paling atas.
   id: huruf kecil, angka, tanda minus (dipakai untuk menghitung klik).
   img: foto ada di repositori ini (mis. folder assets/). Kalau foto belum ada, kartu tampil polos tanpa foto. */
var P=[
{id:"kaos-rib-knit-y2k-vintage-t-shirt-wanita-6050",name:"Kaos Rib Knit Y2K Vintage T-Shirt Wanita 6050",meta:"",img:"https://down-id.img.susercontent.com/file/id-11134207-7rbkb-m95q25pklwy9cd",url:"https://s.shopee.co.id/20xNg9lbdb"},
{id:"yoora-cardi-korea-kardigan-wanita-premium",name:"YOORA CARDI KOREA Kardigan Wanita Premium",meta:"",img:"https://down-id.img.susercontent.com/file/id-11134207-7r990-ltbpi1ppngqhbe",url:"https://s.shopee.co.id/8AY10zNNsx"},
{id:"papadi-blouse-putih-korean-style-ib0024",name:"PAPADI Blouse Putih Korean Style IB0024",meta:"",img:"https://down-id.img.susercontent.com/file/sg-11134201-23030-lrdfg36pupovd7",url:"https://s.shopee.co.id/1CJGHwOK1"},
{id:"heysoul-one-shoulder-sheer-drawstring-top",name:"HEYSOUL One Shoulder Sheer Drawstring Top",meta:"",img:"https://down-id.img.susercontent.com/file/id-11134207-8224z-mh8urxsy17uz42",url:"https://s.shopee.co.id/3qP1orWTyu"},
{id:"tgif-violet-blouse-renda-korean-style",name:"TGIF VIOLET Blouse Renda Korean Style",meta:"",img:"https://down-id.img.susercontent.com/file/8277bc4a3e652d8589c2b4f07ad4c644",url:"https://s.shopee.co.id/5qA6BV3QOJ"},
{id:"heysoul-soft-y2k-lace-top-off-shoulder",name:"HEYSOUL Soft Y2K Lace Top Off Shoulder",meta:"",img:"https://down-id.img.susercontent.com/file/sg-11134201-821cx-mghopmupyd581a",url:"https://s.shopee.co.id/2Vte5qORDJ"},
{id:"mosa-dress-pesta-gaun-evening-1236",name:"MOSA Dress Pesta Premium 1236",meta:"",img:"https://down-id.img.susercontent.com/file/id-11134201-81zte-mtomxy0u3vgka5",url:"https://s.shopee.co.id/9fMocqJ82E"},
{id:"cammomile-new-berry-af-outer-2307011",name:"Cammomile New BERRY AF Outer Korea Style",meta:"",img:"https://down-id.img.susercontent.com/file/id-11134207-81ztj-mrvltbevc4co06",url:"https://s.shopee.co.id/8fUHQqI2QH"},
{id:"kiwi-keren-atasan-renda-hijab-friendly",name:"KIWI KEREN Atasan Renda Wanita Hijab Friendly Casual",meta:"",img:"https://down-id.img.susercontent.com/file/fd4122ba045f09703d9954c7c27da3f0",url:"https://s.shopee.co.id/W8ZhAzI2l"},
{id:"kiwi-lisa-blouse-renda-korean-style",name:"KIWI LISA Blouse Renda Korean Style",meta:"",img:"https://down-id.img.susercontent.com/file/0165c185dee109ab89f4c056c079fe3c",url:"https://s.shopee.co.id/6fjD2IuOz3"},
{id:"hi-ziraaa-candy-blouse-stripe",name:"hi.ziraaa Candy Blouse Stripe Korean Style",meta:"",img:"https://down-id.img.susercontent.com/file/id-11134207-7r98p-lw71co33roda82",url:"https://s.shopee.co.id/1W16sG4m8t"},
{id:"kiwi-marcinda-blouse-lengan-panjang",name:"KIWI Marcinda Blouse Tali Pinggang",meta:"",img:"https://down-id.img.susercontent.com/file/id-11134207-7ra0m-mcaehdanfk8ya1",url:"https://s.shopee.co.id/6q2dA1CeHI"},
{id:"arika-blouse-stripe-peplum-puff",name:"Arika Blouse Stripe Peplum Puff",meta:"",img:"https://down-id.img.susercontent.com/file/id-11134207-7ra0p-mc4gajhtxyyk2d",url:"https://s.shopee.co.id/4B1ryu5EEj"},
{id:"jacket-crope-baseball-korean-style",name:"Jacket Crope Baseball Korean Style",meta:"",img:"https://down-id.img.susercontent.com/file/id-11134207-7rask-m0zkjxkwzgy261",url:"https://s.shopee.co.id/6VPmkI50kq"},
{id:"jaket-kulit-crop-cyber-gotik-wanita",name:"Jaket Kulit Crop Cyber Gotik Wanita",meta:"",img:"https://down-id.img.susercontent.com/file/id-11134207-7rasf-m388nh0zfpnk6d",url:"https://s.shopee.co.id/3LSkyHa90Z"},
{id:"jeaniqlo-celana-jeans-wide-leg-biru",name:"JEANIQLO Celana Jeans Wide Leg Biru",meta:"",img:"https://down-id.img.susercontent.com/file/id-11134207-81zth-mvd06x2713pk13",url:"https://s.shopee.co.id/9fMoSYtgzw"},
{id:"answer-me-jaket-crop-wanita-korean-style",name:"Answer Me Jaket Crop Korean Style",meta:"",img:"https://down-id.img.susercontent.com/file/sg-11134201-8259m-mrou5scxant1bf",url:"https://s.shopee.co.id/Lp9LE2rx0"},
{id:"double-zipp-crope-japanese-jaket-wanita",name:"Double Zipp Crope Japanese Jacket",meta:"",img:"https://down-id.img.susercontent.com/file/id-11134207-7rasi-m23z96reoa99a7",url:"https://s.shopee.co.id/60TW5MFzsr"},
{id:"jam-tangan-rebirth-luxury-diamond-quartz",name:"Jam Tangan Rebirth Luxury Diamond Quartz",meta:"",img:"https://down-id.img.susercontent.com/file/id-11134207-81ztj-ms245rhxu32e83",url:"https://s.shopee.co.id/BVimKTMvj"},
{id:"chard-wake-jam-tangan-wanita",name:"Chard Wake Jam Tangan Wanita",meta:"",img:"https://down-id.img.susercontent.com/file/id-11134207-8224y-mgivbod6osged5",url:"https://s.shopee.co.id/9077IJfjUY"},
{id:"jam-tangan-yunn-analog-korea-mini-slim",name:"Jam Tangan Yunn Analog Korea Mini Slim",meta:"",img:"https://down-id.img.susercontent.com/file/id-11134207-81ztd-meth2anidu6869",url:"https://s.shopee.co.id/BVilSoDfG"},
{id:"croptop-hoodie-lisa-blackpink",name:"Croptop Hoodie Lisa Blackpink",meta:"",img:"https://down-id.img.susercontent.com/file/id-11134207-81zte-mubvde1mpudg53",url:"https://s.shopee.co.id/4B1qzrTfjn"},
{id:"jaket-korduroi-pendek-retro-wanita",name:"Jaket Korduroi Pendek Retro Wanita",meta:"",img:"https://down-id.img.susercontent.com/file/id-11134207-7qukw-lk3e9s3tywiyd2",url:"https://s.shopee.co.id/9AQWwQGd7g"},
{id:"set-gelang-ctr-nagita-clover",name:"Set Gelang CTR Nagita & Clover",meta:"",img:"https://down-id.img.susercontent.com/file/id-11134207-822wr-mpuv70okioe8c0",url:"https://s.shopee.co.id/8KrPvYfA5l"},
{id:"holly-sling-bag-mini-wanita",name:"Holly Sling Bag Mini Wanita",meta:"",img:"https://down-id.img.susercontent.com/file/id-11134207-81ztp-merayq8irc3k95",url:"https://s.shopee.co.id/AUvuV7LUDZ"},
{id:"jaket-wanita-crop-kekinian",name:"Jaket Wanita Crop Kekinian",meta:"",img:"https://down-id.img.susercontent.com/file/id-11134207-7r98q-lvypw79co8q6f7",url:"https://s.shopee.co.id/6AmvK0rwfK"},
{id:"cardigan-korea-premium-blazer-tweed-2267",name:"Cardigan Korea Premium Blazer Tweed 2267",meta:"",img:"https://down-id.img.susercontent.com/file/8ccca678de27dd93657e121a5151469c",url:"https://s.shopee.co.id/5fqeguGc2j"},
{id:"sevine-kiora-sling-bag",name:"Sevine Kiora Sling Bag Bagcharm",meta:"",img:"https://down-id.img.susercontent.com/file/id-11134207-8224y-mkc0fxqf8lxk95",url:"https://s.shopee.co.id/2gD36foKvU"},
{id:"cardigan-rajut-tali-pita-panjang",name:"Cardigan Rajut Tali Pita Panjang",meta:"",img:"https://down-id.img.susercontent.com/file/id-11134207-7rask-m2hlmmu05hoj88",url:"https://s.shopee.co.id/9Kjx0O1YCN"},
{id:"blouse-knit-kerah-pita-salur",name:"Blouse Knit Kerah Pita Salur",meta:"",img:"https://down-id.img.susercontent.com/file/id-11134207-7rasf-m2t2sq78upmne0",url:"https://s.shopee.co.id/7AfSIJQciZ"},
{id:"rajut-wanita-korean-style-motif-bear-garis",name:"Rajut Wanita Korean Style Motif Bear Garis",meta:"",img:"assets/rajut-wanita-korean-style-motif-bear-garis.jpg",url:"https://s.shopee.co.id/Lp88n72NF"},
{id:"cardigan-rajut-crop-top-tali-motif-bunga-bahan",name:"Cardigan Rajut Crop Top Tali Motif Bunga Bahan",meta:"",img:"assets/cardigan-rajut-crop-top-tali-motif-bunga-bahan.jpg",url:"https://s.shopee.co.id/2gD2pyGQ2y"},
{id:"cardigan-crop-flower-premium-rajut-sweater-wanita",name:"Cardigan Crop Flower Premium Rajut Sweater Wanita",meta:"",img:"assets/cardigan-crop-flower-premium-rajut-sweater-wanita.jpg",url:"https://s.shopee.co.id/2BGlqUQEiS"},
{id:"one-set-wanita-katun-rami-premium",name:"One Set Wanita Katun Rami Premium",meta:"",img:"assets/one-set-wanita-katun-rami-premium.jpg",url:"https://s.shopee.co.id/9zzd5t72Xk"},
{id:"one-set-christmas-2027",name:"One Set Christmas 2027",meta:"",img:"assets/one-set-christmas-2027.jpg",url:"https://s.shopee.co.id/2VtboPBPGB"},
{id:"atasan-crop-top",name:"Atasan Crop Top Wanita Dewasa",meta:"",img:"assets/atasan-crop-top.jpg",url:"https://s.shopee.co.id/8VAnWbEPAN"},
{id:"dress-biru-ruffle",name:"Dress Biru Ruffle Layer Soft Girl Long Dress",meta:"",img:"assets/dress-biru-ruffle.jpg",url:"https://s.shopee.co.id/AUvrsYQEBD"},
{id:"payung-romansa",name:"Payung Romansa",meta:"",img:"Payung%20Romansa.jpg",url:"https://s.shopee.co.id/1W138AAmFo"},
{id:"atasan-zelena",name:"ATASAN ZELENA",meta:"",img:"assets/atan.jpg",url:"https://s.shopee.co.id/BVgJT3QU7"}
];
var B=[
["Arc Studio","Brand contoh bergaya utilitarian modern. Ganti teks ini dengan deskripsi, asal negara, dan sumber resmi brand."],
["Kuro Wear","Brand contoh bernuansa monokrom dan minimalis. Isi dengan keterangan brand yang sudah diverifikasi."],
["Nimbus","Brand contoh untuk sneakers dan aksesori harian. Isi dengan deskripsi dan tautan situs resmi."]
];
