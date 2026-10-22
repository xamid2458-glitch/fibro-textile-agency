import React, { useEffect, useMemo, useState } from 'react';
import { supabase, hasSupabaseConfig } from './supabase.js';
import Scene, { MiniScene } from './Scene.jsx';
import { ArrowDownRight, ArrowRight, ArrowUpRight, Check, ChevronDown, CircleHelp, Globe2, Layers3, LockKeyhole, LogOut, Menu, PackagePlus, Pencil, Plus, Save, ShieldCheck, Trash2, Upload, X } from 'lucide-react';

const starterProducts = [
  { id: 'seed-1', name: 'Полиэстер PSF', subtitle: 'POLYESTER STAPLE FIBRE', description: 'Универсальное синтетическое волокно для текстильного производства.', category: 'Синтетические волокна', published: true, image_url: null, sort_order: 1 },
  { id: 'seed-2', name: 'Вискоза VSF', subtitle: 'VISCOSE STAPLE FIBRE', description: 'Мягкое волокно для материалов с комфортной фактурой.', category: 'Целлюлозные волокна', published: true, image_url: null, sort_order: 2 },
  { id: 'seed-3', name: 'Акриловая пряжа', subtitle: 'ACRYLIC FIBRE & YARN', description: 'Практичный материал для разнообразных текстильных изделий.', category: 'Синтетические волокна', published: true, image_url: null, sort_order: 3 },
  { id: 'seed-4', name: 'Специальные волокна', subtitle: 'BAMBOO · MODAL · ELASTANE', description: 'Специализированные материалы под различные задачи производства.', category: 'Специальные материалы', published: true, image_url: null, sort_order: 4 }
];

const initialContent = {
  phone: '+998 91 464 46 63',
  whatsapp: '998914644663',
  address: 'Building 17A, Yangiul, dead end street 2, 111800, Tashkent, Uzbekistan',
  email: '',
  tagline: 'TEXTURE · TECHNOLOGY · TRUST'
};

function Header({ onAdmin }) {
  const [open, setOpen] = useState(false);
  return <header className="header">
    <a className="brand" href="#top" onClick={() => setOpen(false)}><span className="brand-emblem">F</span><span>FIBRO<span className="brand-dot">.</span><small>TEXTILE AGENCY</small></span></a>
    <button className="mobile-menu" onClick={() => setOpen(!open)} aria-label="Открыть меню">{open ? <X /> : <Menu />}</button>
    <nav className={open ? 'nav nav-open' : 'nav'}>
      <a href="#materials" onClick={() => setOpen(false)}>Материалы</a><a href="#company" onClick={() => setOpen(false)}>Компания</a><a href="#approach" onClick={() => setOpen(false)}>Наш подход</a><a href="#contact" onClick={() => setOpen(false)}>Контакты</a>
    </nav>
    <a className="header-cta" href="#contact">Обсудить поставку <ArrowUpRight size={14}/></a>
    <button className="admin-shortcut" onClick={onAdmin} title="Вход администратора"><LockKeyhole size={15}/></button>
  </header>;
}

function ProductCard({ product, index }) {
  return <article className="product-card reveal" style={{ '--delay': `${index * 90}ms` }}>
    <div className="product-meta"><span>0{index + 1} / MATERIAL</span><ArrowUpRight size={15}/></div>
    {product.image_url ? <div className="product-photo"><img src={product.image_url} alt={product.name}/></div> : <MiniScene index={index}/>}
    <div className="product-card-copy"><span className="product-category">{product.category || 'Текстильное сырьё'}</span><h3>{product.name}</h3><p>{product.description}</p><span className="product-subtitle">{product.subtitle}</span></div>
  </article>;
}

function AdminLogin({ onClose, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function submit(e) {
    e.preventDefault(); setBusy(true); setError('');
    const result = await onLogin(email, password);
    if (result?.error) setError(result.error);
    setBusy(false);
  }
  return <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}>
    <section className="login-modal">
      <button className="modal-close" onClick={onClose} aria-label="Закрыть"><X/></button>
      <div className="modal-icon"><ShieldCheck size={24}/></div><div className="eyebrow">FIBRO / ADMIN</div><h2>Панель управления</h2>
      <p>Войдите с учётной записью администратора, созданной в Supabase.</p>
      {!hasSupabaseConfig && <div className="notice warning"><CircleHelp size={17}/> Сначала подключите Supabase: заполните файл .env и выполните инструкции в README.</div>}
      <form onSubmit={submit} className="admin-form"><label>Email администратора<input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@company.com"/></label><label>Пароль<input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Ваш пароль"/></label>
      {error && <div className="form-error">{error}</div>}<button className="button button-full" disabled={busy || !hasSupabaseConfig}>{busy ? 'Входим…' : 'Войти в админ-панель'} <ArrowRight size={16}/></button></form>
      <small className="security-note"><LockKeyhole size={13}/> Доступ защищён авторизацией и политиками базы данных.</small>
    </section>
  </div>;
}

function ProductEditor({ product, onSave, onCancel, saving }) {
  const [form, setForm] = useState(product || { name: '', subtitle: '', description: '', category: 'Текстильное сырьё', published: true, image_url: '' });
  const [file, setFile] = useState(null);
  const change = (key, value) => setForm(old => ({ ...old, [key]: value }));
  function submit(e) { e.preventDefault(); onSave(form, file); }
  return <form className="editor-form" onSubmit={submit}>
    <div className="editor-title"><div><span className="eyebrow">CATALOG / EDITOR</span><h3>{product?.id ? 'Изменить товар' : 'Добавить товар'}</h3></div><button type="button" className="icon-button" onClick={onCancel}><X/></button></div>
    <label>Название товара<input required value={form.name} onChange={e => change('name', e.target.value)} placeholder="Например, Polyester PSF"/></label>
    <label>Подзаголовок / тип сырья<input value={form.subtitle || ''} onChange={e => change('subtitle', e.target.value)} placeholder="POLYESTER STAPLE FIBRE"/></label>
    <label>Категория<input value={form.category || ''} onChange={e => change('category', e.target.value)} placeholder="Синтетические волокна"/></label>
    <label>Описание<textarea rows="4" value={form.description || ''} onChange={e => change('description', e.target.value)} placeholder="Краткое описание материала"/></label>
    <label className="upload-box"><Upload size={20}/><span><strong>{file ? file.name : 'Загрузить фото товара'}</strong><small>JPG, PNG или WebP; до 5 МБ</small></span><input type="file" accept="image/png,image/jpeg,image/webp" onChange={e => setFile(e.target.files?.[0] || null)}/></label>
    {form.image_url && !file && <div className="current-image"><img src={form.image_url} alt="Текущее изображение"/> <button type="button" className="text-button" onClick={() => change('image_url', '')}>Убрать изображение</button></div>}
    <label className="toggle-line"><input type="checkbox" checked={Boolean(form.published)} onChange={e => change('published', e.target.checked)}/><span>Опубликовать товар на сайте</span></label>
    <div className="editor-actions"><button type="button" className="button button-ghost" onClick={onCancel}>Отмена</button><button className="button" disabled={saving}>{saving ? 'Сохраняем…' : <><Save size={16}/> Сохранить</>}</button></div>
  </form>;
}

function AdminDashboard({ session, products, refreshProducts, settings, refreshSettings, onLogout, onClose }) {
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [tab, setTab] = useState('products');
  const [contentForm, setContentForm] = useState(settings || initialContent);
  useEffect(() => setContentForm(settings || initialContent), [settings]);
  async function saveProduct(form, file) {
    setSaving(true); setMessage('');
    try {
      let image_url = form.image_url || null;
      if (file) {
        if (file.size > 5 * 1024 * 1024) throw new Error('Файл больше 5 МБ. Выберите изображение поменьше.');
        const safeName = file.name.toLowerCase().replace(/[^a-z0-9.-]/g, '-');
        const path = `${Date.now()}-${safeName}`;
        const { error: uploadError } = await supabase.storage.from('product-images').upload(path, file, { upsert: true, contentType: file.type });
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('product-images').getPublicUrl(path);
        image_url = data.publicUrl;
      }
      const record = { name: form.name.trim(), subtitle: form.subtitle || '', description: form.description || '', category: form.category || 'Текстильное сырьё', published: Boolean(form.published), image_url, sort_order: form.sort_order || 99 };
      let result;
      if (form.id && !String(form.id).startsWith('seed-')) result = await supabase.from('products').update(record).eq('id', form.id);
      else result = await supabase.from('products').insert(record);
      if (result.error) throw result.error;
      await refreshProducts(); setEditing(null); setMessage('Товар сохранён.');
    } catch (err) { setMessage(`Ошибка: ${err.message}`); }
    finally { setSaving(false); }
  }
  async function deleteProduct(product) {
    if (!window.confirm(`Удалить товар «${product.name}»?`)) return;
    const { error } = await supabase.from('products').delete().eq('id', product.id);
    if (error) setMessage(`Ошибка: ${error.message}`); else { setMessage('Товар удалён.'); await refreshProducts(); }
  }
  async function saveSettings(e) {
    e.preventDefault(); setSaving(true); setMessage('');
    try {
      for (const [key, value] of Object.entries(contentForm)) {
        const { error } = await supabase.from('site_settings').upsert({ key, value }, { onConflict: 'key' });
        if (error) throw error;
      }
      await refreshSettings(); setMessage('Контакты сохранены.');
    } catch (err) { setMessage(`Ошибка: ${err.message}`); }
    finally { setSaving(false); }
  }
  return <div className="admin-shell">
    <aside className="admin-sidebar"><a className="brand" href="#top"><span className="brand-emblem">F</span><span>FIBRO<small>ADMIN STUDIO</small></span></a><div className="sidebar-label">УПРАВЛЕНИЕ</div>
      <button className={tab === 'products' ? 'side-link active' : 'side-link'} onClick={() => { setTab('products'); setEditing(null); }}><Layers3 size={17}/> Каталог товаров</button>
      <button className={tab === 'settings' ? 'side-link active' : 'side-link'} onClick={() => { setTab('settings'); setEditing(null); }}><Globe2 size={17}/> Контакты сайта</button>
      <div className="sidebar-bottom"><span className="admin-user"><span className="user-dot"/><span><strong>Администратор</strong><small>{session.user.email}</small></span></span><button className="side-link" onClick={onLogout}><LogOut size={17}/> Выйти</button><button className="side-link" onClick={onClose}><ArrowRight size={17}/> Открыть сайт</button></div>
    </aside>
    <main className="admin-main"><div className="admin-top"><div><span className="eyebrow">FIBRO / CONTROL ROOM</span><h1>{tab === 'products' ? 'Каталог товаров' : 'Настройки сайта'}</h1><p>Управляйте содержимым сайта без изменения кода.</p></div><span className="admin-status"><i/> Подключено</span></div>
      {message && <div className="notice"><Check size={17}/>{message}<button onClick={() => setMessage('')}><X size={14}/></button></div>}
      {tab === 'products' && (editing ? <ProductEditor product={editing.id ? editing : null} onSave={saveProduct} onCancel={() => setEditing(null)} saving={saving}/> : <><div className="catalog-toolbar"><div><strong>{products.length}</strong> товаров в базе данных <small>Публикация управляется переключателем в редакторе</small></div><button className="button" onClick={() => setEditing({})}><Plus size={17}/> Добавить товар</button></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>ТОВАР</th><th>КАТЕГОРИЯ</th><th>СТАТУС</th><th>ДЕЙСТВИЯ</th></tr></thead><tbody>{products.map(p => <tr key={p.id}><td><div className="table-product">{p.image_url ? <img src={p.image_url} alt=""/> : <span className="table-placeholder"><Layers3 size={17}/></span>}<span><strong>{p.name}</strong><small>{p.subtitle}</small></span></div></td><td>{p.category}</td><td><span className={p.published ? 'status published' : 'status draft'}>{p.published ? 'Опубликован' : 'Черновик'}</span></td><td><div className="table-actions"><button title="Изменить" onClick={() => setEditing(p)}><Pencil size={16}/></button><button title="Удалить" onClick={() => deleteProduct(p)} disabled={String(p.id).startsWith('seed-')}><Trash2 size={16}/></button></div></td></tr>)}</tbody></table></div><p className="admin-hint"><ShieldCheck size={15}/> Черновики видны только администраторам. Публичная база защищена политиками доступа.</p></>)}
      {tab === 'settings' && <form className="settings-form" onSubmit={saveSettings}><h3>Контактная информация</h3><p>Изменения применятся на основном сайте после сохранения.</p><label>Телефон<input value={contentForm.phone || ''} onChange={e => setContentForm({ ...contentForm, phone: e.target.value })}/></label><label>WhatsApp — номер с кодом страны, без знака +<input value={contentForm.whatsapp || ''} onChange={e => setContentForm({ ...contentForm, whatsapp: e.target.value })}/></label><label>Адрес<textarea rows="3" value={contentForm.address || ''} onChange={e => setContentForm({ ...contentForm, address: e.target.value })}/></label><label>Email<input type="email" value={contentForm.email || ''} onChange={e => setContentForm({ ...contentForm, email: e.target.value })}/></label><label>Подпись бренда<input value={contentForm.tagline || ''} onChange={e => setContentForm({ ...contentForm, tagline: e.target.value })}/></label><button className="button" disabled={saving}><Save size={16}/> {saving ? 'Сохраняем…' : 'Сохранить настройки'}</button></form>}
    </main>
  </div>;
}

export default function App() {
  const [products, setProducts] = useState(starterProducts);
  const [settings, setSettings] = useState(initialContent);
  const [adminOpen, setAdminOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [dashboard, setDashboard] = useState(false);
  const [siteError, setSiteError] = useState('');
  const [mobileMenu, setMobileMenu] = useState(false);

  async function refreshProducts() {
    if (!supabase) return;
    const { data, error } = await supabase.from('products').select('*').order('sort_order').order('created_at');
    if (error) { setSiteError(error.message); return; }
    setProducts(data?.length ? data.filter(p => p.published) : []);
  }
  async function refreshSettings() {
    if (!supabase) return;
    const { data, error } = await supabase.from('site_settings').select('key,value');
    if (error) return;
    setSettings(old => ({ ...old, ...(data || []).reduce((acc, row) => ({ ...acc, [row.key]: row.value }), {}) }));
  }
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => setSession(newSession));
    refreshProducts(); refreshSettings();
    return () => listener.subscription.unsubscribe();
  }, []);
  useEffect(() => {
    if (session && dashboard) { refreshProducts(); refreshSettings(); }
  }, [session, dashboard]);
  async function login(email, password) {
    if (!supabase) return { error: 'Supabase ещё не подключён. Сначала настройте .env.' };
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    const { data: admin, error: adminError } = await supabase.from('admin_users').select('user_id').eq('user_id', data.user.id).maybeSingle();
    if (adminError || !admin) {
      await supabase.auth.signOut();
      return { error: 'У этой учётной записи нет прав администратора. Добавьте её в таблицу admin_users по инструкции README.' };
    }
    setSession(data.session); setAdminOpen(false); setDashboard(true);
    return {};
  }
  async function logout() {
    if (supabase) await supabase.auth.signOut();
    setSession(null); setDashboard(false); setAdminOpen(false);
  }
  useEffect(() => {
    const reveal = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); reveal.unobserve(e.target); }
    }), { threshold: 0.12 });
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => reveal.observe(el));
    return () => reveal.disconnect();
  }, [products, dashboard]);

  if (dashboard && session) return <AdminDashboard session={session} products={products} refreshProducts={refreshProducts} settings={settings} refreshSettings={refreshSettings} onLogout={logout} onClose={() => setDashboard(false)}/>;

  return <div className="site-shell" id="top">
    <div className="top-ribbon"><span>TEXTILE RAW MATERIALS</span><i/> Узбекистан · Центральная Азия <i/><span>EST. 2013</span></div>
    <Header onAdmin={() => setAdminOpen(true)}/>
    <main>
      <section className="hero">
        <div className="hero-content"><div className="eyebrow"><span className="eyebrow-line"/> TEXTILE AGENCY · SINCE 2013</div>
          <h1>Основа<br/>для <em>будущего</em><br/><span className="outline-text">текстиля.</span></h1>
          <p className="hero-description">Текстильное сырьё и пряжа от мировых производителей. Материалы, из которых начинается качество — для предприятий Узбекистана и Центральной Азии.</p>
          <div className="hero-actions"><a className="button" href="#materials">Изучить материалы <ArrowUpRight size={17}/></a><a className="quiet-link" href="#company">О компании <ArrowRight size={16}/></a></div>
          <div className="hero-stats"><div><strong>2013</strong><span>Год основания</span></div><div><strong>Central Asia</strong><span>Наш регион</span></div><div><strong>Global</strong><span>Поставщики сырья</span></div></div>
        </div>
        <div className="hero-art"><div className="art-grid"/><div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/><div className="art-orbit orbit-three"/><Scene/><div className="art-label label-top"><i/> ENGINEERED TEXTURES</div><div className="art-label label-bottom">FIBRO / 001 <ArrowUpRight size={14}/></div><div className="art-side-note">MATERIALS · MOTION · QUALITY</div></div>
        <a className="scroll-cue" href="#materials"><span>Листайте вниз</span><ArrowDownRight size={15}/></a>
      </section>
      <div className="ticker"><div className="ticker-track">{['POLYESTER PSF','VISCOSE VSF','ACRYLIC YARN','BAMBOO FIBRE','ELASTANE','MODAL','POLYESTER DTY','RING SPUN', 'POLYESTER PSF','VISCOSE VSF','ACRYLIC YARN','BAMBOO FIBRE','ELASTANE','MODAL','POLYESTER DTY','RING SPUN'].map((t,i)=><span key={i}>{t}<b>✳</b></span>)}</div></div>
      <section className="section materials-section" id="materials"><div className="section-heading reveal"><div><div className="eyebrow"><span className="eyebrow-line"/> НАШ АССОРТИМЕНТ</div><h2>Материалы для<br/><em>больших идей.</em></h2></div><p>Подбираем текстильное сырьё под требования производства — от базовых волокон до специализированной пряжи.</p></div>
        <div className="products-grid">{products.filter(p => p.published).map((product,index)=><ProductCard key={product.id} product={product} index={index}/>)}</div>
        {products.filter(p => p.published).length === 0 && <div className="empty-catalog">Каталог обновляется. Свяжитесь с нами, чтобы узнать о доступных материалах.</div>}
      </section>
      <section className="company-section" id="company"><div className="company-inner"><div className="company-copy reveal"><div className="eyebrow dark-eyebrow"><span className="eyebrow-line"/> О КОМПАНИИ FIBRO</div><h2>Связываем сырьё<br/>и <em>возможности.</em></h2><p>FIBRO TEXTILE AGENCY — компания, специализирующаяся на поставках текстильного сырья и пряжи. С 2013 года мы работаем с производителями Узбекистана и Центральной Азии, помогая находить материалы от ведущих мировых производителей.</p><p>Наша философия проста: правильный материал, прозрачная коммуникация и партнёрство, рассчитанное на долгую перспективу.</p><div className="company-numbers"><div><strong>2013</strong><span>Начало нашей работы</span></div><div><strong>∞</strong><span>Возможности для текстиля</span></div></div></div><div className="company-art reveal"><div className="company-art-ring"/><div className="company-fibre"><div className="fibre-inner"/></div><div className="company-stamp">FIBRO<br/><span>TEXTILE AGENCY</span></div><div className="company-art-caption">RAW MATERIAL / NATURAL FORM</div></div></div></section>
      <section className="section approach-section" id="approach"><div className="section-heading reveal"><div><div className="eyebrow"><span className="eyebrow-line"/> НАШ ПОДХОД</div><h2>Серьёзный подход.<br/><em>Надёжная основа.</em></h2></div><p>Понимаем, что каждому производству важны подходящий материал, понятные условия и стабильная коммуникация.</p></div><div className="approach-grid"><article className="approach-card reveal"><span>01 / UNDERSTAND</span><div className="approach-icon"><Layers3/></div><h3>Изучаем задачу</h3><p>Уточняем тип сырья, требования к материалу и специфику вашего производства.</p></article><article className="approach-card reveal"><span>02 / SELECT</span><div className="approach-icon"><Globe2/></div><h3>Подбираем решение</h3><p>Обсуждаем доступные материалы и параметры, которые важны для результата.</p></article><article className="approach-card reveal"><span>03 / CONNECT</span><div className="approach-icon"><ArrowUpRight/></div><h3>Выстраиваем связь</h3><p>Обсуждаем ассортимент, условия поставки и следующие шаги сотрудничества.</p></article></div></section>
      <section className="contact-section" id="contact"><div className="contact-inner"><div className="contact-copy reveal"><div className="eyebrow"><span className="eyebrow-line"/> НАЧНЁМ ДИАЛОГ</div><h2>Ваше производство.<br/>Наши <em>материалы.</em></h2><p>Расскажите, какое сырьё вам необходимо. Свяжитесь с командой FIBRO, чтобы обсудить ассортимент и возможности сотрудничества.</p><a className="button" href={`https://wa.me/${settings.whatsapp || initialContent.whatsapp}`} target="_blank" rel="noreferrer">Написать в WhatsApp <ArrowUpRight size={17}/></a></div>
        <div className="contact-card reveal"><div className="contact-card-head"><span>FIBRO / CONTACT</span><span className="online"><i/> На связи</span></div><div className="contact-row"><small>ТЕЛЕФОН</small><a href={`tel:${(settings.phone || initialContent.phone).replace(/[^\d+]/g,'')}`}>{settings.phone || initialContent.phone} <ArrowUpRight size={14}/></a></div>{settings.email && <div className="contact-row"><small>EMAIL</small><a href={`mailto:${settings.email}`}>{settings.email}</a></div>}<div className="contact-row"><small>WHATSAPP</small><a href={`https://wa.me/${settings.whatsapp || initialContent.whatsapp}`} target="_blank" rel="noreferrer">Написать сообщение <ArrowUpRight size={14}/></a></div><div className="contact-row"><small>АДРЕС</small><p>{settings.address || initialContent.address}</p></div></div></div></section>
    </main>
    <footer className="footer"><a className="footer-brand" href="#top">FIBRO<span>.</span></a><span>{settings.tagline || initialContent.tagline}</span><span>© {new Date().getFullYear()} FIBRO TEXTILE AGENCY</span><button onClick={() => setAdminOpen(true)} className="footer-admin"><LockKeyhole size={12}/> ADMIN</button></footer>
    {adminOpen && <AdminLogin onClose={() => setAdminOpen(false)} onLogin={login}/>}
    {!hasSupabaseConfig && <div className="dev-banner"><CircleHelp size={14}/> DEMO MODE — подключите Supabase, чтобы включить каталог и админ-панель.</div>}
  </div>;
}
