import { useState } from 'react';
import { Plus, Trash2, Image } from 'lucide-react';
import { adminFetch } from '@/context/AdminAuthContext';

interface Variant {
    color: string;
    size: string;
    gsm: string;
    price: string;
    stock: string;
    image: string;
}

interface Props {
    variants: Variant[];
    onChange: (variants: Variant[]) => void;
}

const VariantBuilder = ({ variants, onChange }: Props) => {
    const [colors, setColors] = useState<string[]>(['']);
    const [sizes, setSizes] = useState<string[]>(['']);
    const [gsms, setGsms] = useState<string[]>(['']);
    const [uploading, setUploading] = useState<number | null>(null);

    const addTag = (list: string[], setList: (v: string[]) => void) => setList([...list, '']);
    const removeTag = (list: string[], setList: (v: string[]) => void, i: number) => setList(list.filter((_, idx) => idx !== i));
    const updateTag = (list: string[], setList: (v: string[]) => void, i: number, val: string) => {
        const updated = [...list]; updated[i] = val; setList(updated);
    };

    const generate = () => {
        const validColors = colors.filter(Boolean);
        const validSizes = sizes.filter(Boolean);
        const validGsms = gsms.filter(Boolean);
        const combos: Variant[] = [];
        const generateCombinations = (colorArr: string[], sizeArr: string[], gsmArr: string[]) => {
            const cols = colorArr.length ? colorArr : [''];
            const szs = sizeArr.length ? sizeArr : [''];
            const gms = gsmArr.length ? gsmArr : [''];
            for (const c of cols) for (const s of szs) for (const g of gms) {
                const existing = variants.find(v => v.color === c && v.size === s && v.gsm === g);
                combos.push(existing || { color: c, size: s, gsm: g, price: '', stock: '', image: '' });
            }
        };
        generateCombinations(validColors, validSizes, validGsms);
        onChange(combos);
    };

    const updateVariant = (i: number, field: keyof Variant, value: string) => {
        const updated = [...variants];
        updated[i] = { ...updated[i], [field]: value };
        onChange(updated);
    };

    const uploadImage = async (i: number, file: File) => {
        setUploading(i);
        const formData = new FormData();
        formData.append('image', file);
        const token = localStorage.getItem('zued_admin_token');
        const res = await fetch('/api/admin/upload', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
        });
        const json = await res.json();
        if (json.url) updateVariant(i, 'image', json.url);
        setUploading(null);
    };

    const TagInput = ({ label, list, setList }: { label: string; list: string[]; setList: (v: string[]) => void }) => (
        <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{label}</p>
            <div className="flex flex-wrap gap-2">
                {list.map((val, i) => (
                    <div key={i} className="flex items-center gap-1">
                        <input
                            type="text"
                            value={val}
                            onChange={e => updateTag(list, setList, i, e.target.value)}
                            placeholder={label.split(' ')[0]}
                            className="bg-secondary border border-border rounded-sm px-2 py-1 text-xs text-foreground w-24 focus:outline-none focus:border-gold/60"
                        />
                        {list.length > 1 && (
                            <button type="button" onClick={() => removeTag(list, setList, i)} className="text-muted-foreground hover:text-destructive transition-colors">
                                <Trash2 size={12} />
                            </button>
                        )}
                    </div>
                ))}
                <button type="button" onClick={() => addTag(list, setList)} className="text-gold hover:text-gold/80 transition-colors">
                    <Plus size={14} />
                </button>
            </div>
        </div>
    );

    return (
        <div className="space-y-4">
            <div className="glass-card rounded-sm p-4 border border-border/60 space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Define Attributes</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <TagInput label="Colors" list={colors} setList={setColors} />
                    <TagInput label="Sizes" list={sizes} setList={setSizes} />
                    <TagInput label="GSM Options" list={gsms} setList={setGsms} />
                </div>
                <button type="button" onClick={generate} className="btn-gold px-4 py-2 rounded-sm text-xs flex items-center gap-2">
                    <Plus size={13} /> Generate Variants
                </button>
            </div>

            {variants.length > 0 && (
                <div className="glass-card rounded-sm border border-border/60 overflow-hidden">
                    <div className="px-4 py-3 border-b border-border/40">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{variants.length} Variants</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="border-b border-border/40 bg-secondary/30">
                                    {['Color', 'Size', 'GSM', 'Price (₹)', 'Stock', 'Image'].map(h => (
                                        <th key={h} className="text-left px-3 py-2 text-muted-foreground uppercase tracking-wider font-medium">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {variants.map((v, i) => (
                                    <tr key={i} className="border-b border-border/30 last:border-0 hover:bg-secondary/10">
                                        <td className="px-3 py-2 text-foreground/80">{v.color || '—'}</td>
                                        <td className="px-3 py-2 text-foreground/80">{v.size || '—'}</td>
                                        <td className="px-3 py-2 text-foreground/80">{v.gsm || '—'}</td>
                                        <td className="px-3 py-2">
                                            <input type="number" value={v.price} onChange={e => updateVariant(i, 'price', e.target.value)} required
                                                className="bg-secondary border border-border rounded-sm px-2 py-1 w-20 text-foreground focus:outline-none focus:border-gold/60" />
                                        </td>
                                        <td className="px-3 py-2">
                                            <input type="number" value={v.stock} onChange={e => updateVariant(i, 'stock', e.target.value)}
                                                className="bg-secondary border border-border rounded-sm px-2 py-1 w-16 text-foreground focus:outline-none focus:border-gold/60" />
                                        </td>
                                        <td className="px-3 py-2">
                                            {v.image ? (
                                                <div className="flex items-center gap-2">
                                                    <img src={v.image} className="w-8 h-8 object-cover rounded-sm border border-border" />
                                                    <label className="text-gold cursor-pointer hover:underline text-[10px]">
                                                        Change
                                                        <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files && uploadImage(i, e.target.files[0])} />
                                                    </label>
                                                </div>
                                            ) : (
                                                <label className="flex items-center gap-1 text-muted-foreground hover:text-gold cursor-pointer transition-colors">
                                                    {uploading === i ? '...' : <><Image size={12} /><span>Upload</span></>}
                                                    <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files && uploadImage(i, e.target.files[0])} />
                                                </label>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VariantBuilder;
