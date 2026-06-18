const fs = require('fs');

const idKeys = {
  profil: {
    header: {
      title: "Detail Profil Role",
      description: "Halaman ini menampilkan informasi identitas pengguna, peran aktif, serta status akun yang digunakan dalam Sistem Informasi Monitoring dan Evaluasi Terpadu (SI-IMOET). Informasi yang tersedia membantu pengguna memastikan akun dan kewenangan yang dimiliki sesuai dengan perannya di dalam sistem."
    },
    card: {
      title: "Profil",
      email: "EMAIL",
      peranUtama: "PERAN UTAMA",
      peranSaatIni: "PERAN SAAT INI",
      bergabungSejak: "bergabung sejak",
      statusAktif: "STATUS AKTIF"
    },
    edit: {
      title: "Edit Profil",
      description: "Perbarui informasi profil Anda",
      fotoClick: "Klik foto untuk mengganti portfolio/foto.",
      fotoMaxSize: "(Maksimal size 2MB)",
      namaLengkap: "Nama Lengkap",
      email: "Email",
      instagram: "Username Instagram",
      linkedin: "URL LinkedIn",
      simpan: "Simpan Perubahan",
      berhasil: "Profil berhasil diperbarui",
      gagal: "Terjadi kesalahan saat memperbarui profil"
    }
  }
};

const enKeys = {
  profil: {
    header: {
      title: "Role Profile Details",
      description: "This page displays user identity information, active roles, and account status used in the Integrated Monitoring and Evaluation Information System (SI-IMOET). The provided information helps users ensure their account and permissions match their role in the system."
    },
    card: {
      title: "Profile",
      email: "EMAIL",
      peranUtama: "MAIN ROLE",
      peranSaatIni: "CURRENT ROLE",
      bergabungSejak: "joined since",
      statusAktif: "ACTIVE STATUS"
    },
    edit: {
      title: "Edit Profile",
      description: "Update your profile information",
      fotoClick: "Click photo to change portfolio/photo.",
      fotoMaxSize: "(Maximum size 2MB)",
      namaLengkap: "Full Name",
      email: "Email",
      instagram: "Instagram Username",
      linkedin: "LinkedIn URL",
      simpan: "Save Changes",
      berhasil: "Profile successfully updated",
      gagal: "An error occurred while updating the profile"
    }
  }
};

const jaKeys = {
  profil: {
    header: {
      title: "役割プロフィールの詳細",
      description: "このページには、統合モニタリングおよび評価情報システム (SI-IMOET) で使用されるユーザーID情報、アクティブな役割、およびアカウントステータスが表示されます。提供された情報は、ユーザーがシステム内の役割と権限が一致していることを確認するのに役立ちます。"
    },
    card: {
      title: "プロフィール",
      email: "メールアドレス",
      peranUtama: "主な役割",
      peranSaatIni: "現在の役割",
      bergabungSejak: "参加日",
      statusAktif: "アクティブステータス"
    },
    edit: {
      title: "プロフィールを編集",
      description: "プロフィール情報を更新します",
      fotoClick: "写真をクリックしてポートフォリオ/写真を変更します。",
      fotoMaxSize: "（最大サイズ 2MB）",
      namaLengkap: "氏名",
      email: "メールアドレス",
      instagram: "Instagramユーザー名",
      linkedin: "LinkedIn URL",
      simpan: "変更を保存",
      berhasil: "プロフィールが正常に更新されました",
      gagal: "プロフィールの更新中にエラーが発生しました"
    }
  }
};

const arKeys = {
  profil: {
    header: {
      title: "تفاصيل ملف تعريف الدور",
      description: "تعرض هذه الصفحة معلومات هوية المستخدم والأدوار النشطة وحالة الحساب المستخدمة في نظام معلومات المراقبة والتقييم المتكامل (SI-IMOET). تساعد المعلومات المقدمة المستخدمين على التأكد من تطابق حسابهم وأذوناتهم مع دورهم في النظام."
    },
    card: {
      title: "الملف الشخصي",
      email: "البريد الإلكتروني",
      peranUtama: "الدور الرئيسي",
      peranSaatIni: "الدور الحالي",
      bergabungSejak: "انضم منذ",
      statusAktif: "الحالة النشطة"
    },
    edit: {
      title: "تعديل الملف الشخصي",
      description: "تحديث معلومات ملفك الشخصي",
      fotoClick: "انقر على الصورة لتغيير الحافظة/الصورة.",
      fotoMaxSize: "(أقصى حجم 2 ميجابايت)",
      namaLengkap: "الاسم الكامل",
      email: "البريد الإلكتروني",
      instagram: "اسم مستخدم إنستغرام",
      linkedin: "رابط لينكد إن",
      simpan: "حفظ التغييرات",
      berhasil: "تم تحديث الملف الشخصي بنجاح",
      gagal: "حدث خطأ أثناء تحديث الملف الشخصي"
    }
  }
};

const files = [
  { path: 'i18n/locales/id_ID.json', keys: idKeys },
  { path: 'i18n/locales/en_US.json', keys: enKeys },
  { path: 'i18n/locales/ja_JP.json', keys: jaKeys },
  { path: 'i18n/locales/ar_SA.json', keys: arKeys },
];

files.forEach(file => {
  if (fs.existsSync(file.path)) {
    const data = JSON.parse(fs.readFileSync(file.path, 'utf8'));
    data.profil = file.keys.profil;
    fs.writeFileSync(file.path, JSON.stringify(data, null, 2));
    console.log('Updated ' + file.path);
  }
});
