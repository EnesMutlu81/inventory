# Precision Inventory Proje Rehberi

Bu belge, Claude üzerinde başlatıp Antigravity üzerinde devam ettiğiniz CRUD (Create, Read, Update, Delete) projesinin uçtan uca mimarisini, dosya-klasör yapılarını ve sisteme kendi başınıza nasıl müdahale edebileceğinizi adım adım açıklamak için hazırlanmıştır.

---

## 1. Proje Mimarisi: Klasör ve Dosya Yapısı

Next.js "App Router" (v13+) kullanılarak oluşturulmuş bu projede Frontend (Önyüz) ve Backend (Arkayüz - Sunucu) aynı projenin içerisindedir. Kodlar birbirlerinden modüler olarak klasörlerle ayrılmıştır.

```text
c:\test_envanter\
├── src/           # Projenin çalıştıran tüm kaynak kodları
│   ├── app/       # 📌 Next.js App Router Dosyaları (Sayfalar ve API Rotaları)
│   │   ├── api/   # 🔙 BACKEND: Sunucu taraflı uç noktalar (Endpoints)
│   │   ├── page.tsx # 🖥️ FRONTEND: Kullanıcıların gördüğü "Ana Sayfa"
│   │   └── layout.tsx # 🖥️ FRONTEND: Tüm sayfaları saran HTML taslağı
│   ├── components/# 🖥️ FRONTEND: Sayfayı oluşturan Lego parçacıkları/UI birimleri
│   ├── hooks/     # ⚙️ FRONTEND MANTIK: API ile frontend'in köprüsü (useInventory gibi)
│   ├── lib/       # 🔧 ORTAK ARAÇLAR: Helper fonksiyonları ve Veritabanı bağlantısı
│   └── types/     # 📚 TİPLER: TypeScript için arayüz tanımları (örn: Part nesnesi)
├── .env           # 🗝️ Şifreler ve Veritabanı URL'leri (GitHub'a atılmaz!)
├── next.config.js # Next.js yapılandırma ayarları
├── tailwind.config.ts # Stil ve tasarım (TailwindCSS) konfigürasyonu
└── package.json   # Yüklü paketlerin (React, MongoDB vs.) ve betiklerin listesi
```

---

## 2. Frontend ve Backend Nasıl Haberleşiyor?

Next.js, modern bir **Full-Stack** framework'tür. 
- **Frontend:** Tarayıcıda çalışır. React kullanır. Siz bir butona bastığınızda (Örn: Parça Ekle), Frontend `src/hooks/useInventory.ts` içindeki `fetch()` metodunu çağırır. 
- **Backend:** Node.js üzerinde çalışır. `http://localhost:3000/api/...` adresine gelen isteği dinler. İsteği alıp veritabanına gider, sonlandırıp sonucu Frontend'e `JSON` olarak döndürür.

### Etkileşim Adımı (Örnek: Parça Silme)
1. **Buton Tıklaması:** Kullanıcı arayüzde (table/card)'daki Sil butonuna basar. `DeleteConfirmModal` açılır.
2. **Kanca (Hook) Çağrısı:** Modal Onay butonuna basınca `useInventory.ts`'deki `deletePart(id)` fonksiyonu çalışır.
3. **HTTP İsteği:** Frontend'den `fetch('/api/parts/[id]', { method: 'DELETE' })` komutuyla Backend'e ağ isteği atılır.
4. **Backend (API) Devreye Girer:** `src/app/api/parts/[id]/route.ts` yolundaki `DELETE` fonksiyonu tetiklenir. Gelen ID veritabanından silinir.
5. **UI (Arayüz) Güncellenir:** API'den "Başarılı (204)" yanıtı geldiğinde frontend `useState` içindeki eski listeyi günceller ve silinmiş parça ekrandan anında kaybolur.

---

## 3. CRUD (Veri) İşlemleri Nerede ve Nasıl Yapılıyor?

Bu projede asıl veri işlemleri **2 dosya arasında** organize edilir:

### A) Frontend Tarafındaki Operasyon: `src/hooks/useInventory.ts`
Kullanıcı bir işlem yaptığında doğrudan veritabanına bağlanılamaz (Güvenlik gereği). Frontend bu işlemleri `fetch` aracılığıyla API'ye iletir:
- **Okuma (C):** `fetch("/api/parts")`
- **Ekleme (R):** `fetch("/api/parts", { method: "POST", ... })`
- **Güncelleme (U):** `fetch("/api/parts/${id}", { method: "PUT", ... })`
- **Silme (D):** `fetch(`/api/parts/${id}`, { method: "DELETE" })`

### B) Backend Tarafındaki DB Komutu: `src/app/api/parts/...`
Gerçek veritabanı iletişimi (MongoDB Driver ile) burada gerçekleşir. 
- `/api/parts/route.ts` => `GET` (Tüm veriler) ve `POST` (Yeni ekleme) fonksiyonlarına sahip. 
- `/api/parts/[id]/route.ts` => `PUT` (Güncelleme) ve `DELETE` (Silme) fonksiyonları barındırır. MongoDB'ye istek atarken `db.collection('spare_parts').deleteOne(...)` gibi direktifler kullanılır.

---

## 4. Veritabanı ve API Bağlantıları

Veritabanı bağlantılarınız proğramınızın beyni **`src/lib/mongodb.ts`** içerisindedir.
Next.js projelerinde veritabanı URL'si (ör. MongoDB veya Postgres) kaynak koda (github'a) asla açık açık yazılmaz. Bunun için **`.env`** kullanılır.

### Bağlantı Nasıl Çalışıyor? (Mantığı)
1. `.env` dosyası içindeki `MONGODB_URI` stringi okunur.
2. `lib/mongodb.ts` sunucu tarafında her istekte MONGODB_URI'yi kullanarak bir Client oluşturmaz. (Oluşturursa uygulamanız yavaşlar). Bir kez Client oluşturur, bunu hafızasında (Singleton Pattern) tutar, tüm gelen isteklerde bu hazır bağlantı borusunu kullanır.

> [!WARNING]
> Veritabanı değiştirmek isterseniz (Örneğin PostgreSQL veya Firebase'e geçerseniz):
> 1. `package.json` üzerinden eski paketi silersiniz (`npm uninstall mongodb`) ve yenisini (`npm install pg` veya `prisma`) yüklersiniz.
> 2. Sadece `src/lib/mongodb.ts` dosyasını silip yerine bağlantıyı sağlayacak `src/lib/postgres.ts` (veya `prisma.ts`) oluşturursunuz.
> 3. API dosyalarında (`route.ts`) bulunan `await db.collection...` silinir, yerine `await postgres.query(...)` yazılır. Frontend, bu durumdan hiç haberdar olmaz. Aynı JSON sonucu alacağı için sistem çalışmaya devam eder.

---

## 5. Uygulamalı Görev: Projeye Manuel Yeni Bir Alan (Sütun) Ekleme (Örn: "Raf Konumu")

Var olan bir sisteme yeni bir özellik ekleyebileceğinizi test edelim. Parçalarınıza artık "Location / Raf Konumu" parametresi eklemek istediğimizi farz edelim:

#### Adım 1: TypeScript Tiplerini (Interface) Güncelleyin
`src/types/inventory.ts` dosyasını açın.
```typescript
export interface SparePart {
  id: string; // mongodan geliyor
  partNumber: string;
  name: string;
  // ... diğer özellikler
  location?: string; // TİPE BUNU EKLİYORUZ (Soru işareti varsayılan olabileceğini belirtir)
}
```

#### Adım 2: Frontend Formuna Kutucuğu Ekleyin
`src/components/modals/PartFormModal.tsx` dosyasını açın. <form> içine yeni bir <input> ekleyin.
```tsx
<div>
  <label className="text-sm font-label text-on-surface">Raf Konumu</label>
  <input 
      type="text" 
      name="location" 
      defaultValue={part?.location || ""}
      className="form-input" 
  />
</div>
```

#### Adım 3: Backend (API) Tarafında Yeni Veriyi Yakalayın
Veri API'ye geldiğinde veritabanına yazılmadan önce yakalanmalıdır.
Tüm Ekleme işlemi için: `src/app/api/parts/route.ts` açın. Güncelleme için `[id]/route.ts` dosyasını açın.
```typescript
// route.ts içinde POST fonksiyonunu bulun
const body = await request.json();
const { partNumber, name, category, quantity, unitPrice, location } = body; // BUNU ÇIKARIN

// Mongo dökümanına ekleyin...
const doc = {
  partNumber,
  name,
  category,
  quantity: Number(quantity),
  unitPrice: Number(unitPrice),
  location: location || "Belirtilmedi", // YENİ ALAN
  status: computeStatus(Number(quantity)),
  lastUpdated: new Date().toISOString(),
};
```

#### Adım 4: Tabloda Arayüze Yansıtın
`src/components/inventory/PartsTable.tsx` dosyasını açın.
```tsx
{/* <thead> içine Yeni Başlık */}
<th>Raf Konumu</th>

{/* <tbody> kısmındaki döngüye veri satırı */}
<td>{part.location || "-"}</td>
```

Bu 4 adımı uyguladığınızda, uygulamanızı en derinden en yüzeye (Veritabanı ↔ Backend ↔ Frontend ↔ Görsellik) kadar kusursuz manipüle etmiş olursunuz!

---

## 6. Sık Karşılaşılan Canlı Yayın (Vercel & Atlas) Ayarları

Geliştirme esnasında `.env` ile MongoDB'ye bağlandıktan sonra, siteyi Vercel'a yüklediğinizde şu iki can alıcı detayı unutmamalısınız:

### A) Vercel Environment Variables
Vercel `.env` dosyanızı GitHub'dan çekmez. Bu sebeple MongoDB bağlantı şifrenizi her zaman Vercel panelinden de eklemelisiniz.
**(Vercel > Settings > Environment Variables > MONGODB_URI)**

### B) Atlas IP Whitelist & Özel Karakterler
Vercel sunucularından gelen isteklere Atlas'ın izin vermesi için `Network Access` sekmesinde `0.0.0.0/0` (Allow Access From Anywhere) izninin olması şarttır. Ayrıca şifrenizde geçen `@` işaretleri, URI formatını bozmaması adına `%40` gibi karakterlere URL-Encoded olarak çevrilerek yazılmalıdır.

### C) Önizleme Linki ve Authentication Koruması
Vercel bazen (URL içinde `git-main` geçen) önizleme linklerini herkese açık yapmaz. Test için girildiğinde Vercel hesabı(login) ister.
Bunu aşmak için projenin Vercel'deki **"Deployments"** veya **"Settings > Deployment Protection"** ayarından **"Vercel Authentication"** özelliğini kapatabilir veya projenin en kısa "Production URL" ana linkini kullanabilirsiniz.
