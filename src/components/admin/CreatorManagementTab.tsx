import { useState, useEffect, useRef } from 'react';
import { X, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../../lib/supabase';

interface CreatorRow {
  id: string;
  name: string;
  email: string;
  revenue_share: number;
  role: string;
  created_at: string;
  avatar_initials: string;
}

function EditableShareCell({ creator, onSaved }: { creator: CreatorRow; onSaved: () => void }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(Math.round(creator.revenue_share * 100).toString());
  const [flash, setFlash] = useState<'saved' | 'failed' | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setValue(Math.round(creator.revenue_share * 100).toString());
  }, [creator.revenue_share]);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  const save = async () => {
    setEditing(false);
    const num = parseFloat(value);
    if (isNaN(num) || num < 50 || num > 100) {
      setValue(Math.round(creator.revenue_share * 100).toString());
      return;
    }

    const share = num / 100;
    if (share === creator.revenue_share) return;

    const { error } = await supabase
      .from('creators')
      .update({ revenue_share: share })
      .eq('id', creator.id);

    if (error) {
      setFlash('failed');
      setValue(Math.round(creator.revenue_share * 100).toString());
    } else {
      setFlash('saved');
      onSaved();
    }
    setTimeout(() => setFlash(null), 1500);
  };

  if (creator.role === 'admin') {
    return <span className="text-cream/30 text-sm">&mdash;</span>;
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        type="number"
        min={50}
        max={100}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => {
          if (e.key === 'Enter') save();
          if (e.key === 'Escape') {
            setValue(Math.round(creator.revenue_share * 100).toString());
            setEditing(false);
          }
        }}
        className="w-16 bg-tavazi-slate border border-tavazi-navy/40 rounded-full px-3 py-1 text-sm text-tavazi-navy text-center font-semibold focus:outline-none focus:ring-2 focus:ring-tavazi-navy/50"
      />
    );
  }

  return (
    <span className="relative inline-flex items-center">
      <button
        onClick={() => setEditing(true)}
        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-tavazi-navy/10 text-tavazi-navy cursor-pointer hover:bg-tavazi-navy/20 transition-colors"
      >
        {Math.round(creator.revenue_share * 100)}%
      </button>
      {flash === 'saved' && (
        <span className="absolute -right-16 text-xs font-semibold text-green-400 animate-pulse whitespace-nowrap">
          Saved ✓
        </span>
      )}
      {flash === 'failed' && (
        <span className="absolute -right-16 text-xs font-semibold text-red-400 animate-pulse whitespace-nowrap">
          Failed
        </span>
      )}
    </span>
  );
}

export default function CreatorManagementTab() {
  const [creators, setCreators] = useState<CreatorRow[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newShare, setNewShare] = useState('65');
  const [creating, setCreating] = useState(false);

  const fetchCreators = async () => {
    const { data } = await supabase
      .from('creators')
      .select('*')
      .order('name');
    if (data) setCreators(data);
  };

  useEffect(() => {
    fetchCreators();
  }, []);

  const handleAddCreator = async () => {
    if (!newName.trim() || !newEmail.trim()) {
      toast.error('Name and email are required');
      return;
    }

    setCreating(true);
    const initials = newName
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const { data: inviteData, error: inviteErr } = await supabase.auth.admin.inviteUserByEmail(
      newEmail.trim()
    );

    if (inviteErr) {
      toast.error('Invite failed: ' + inviteErr.message);
      setCreating(false);
      return;
    }

    const userId = inviteData?.user?.id;
    if (!userId) {
      toast.error('No user ID returned from invite');
      setCreating(false);
      return;
    }

    const { error: insertErr } = await supabase.from('creators').insert({
      user_id: userId,
      name: newName.trim(),
      email: newEmail.trim(),
      avatar_initials: initials,
      revenue_share: parseFloat(newShare) / 100,
      role: 'creator',
    });

    if (insertErr) {
      toast.error('Failed to create profile: ' + insertErr.message);
    } else {
      toast.success('Creator added and invite sent');
      fetchCreators();
      setShowModal(false);
      setNewName('');
      setNewEmail('');
      setNewShare('65');
    }
    setCreating(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-lg text-cream">All Creators</h3>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-tavazi-navy text-tavazi-dark rounded-lg text-sm font-semibold hover:bg-[#339AF0] transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Creator
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-tavazi-navy/15">
              <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-cream/50">Creator</th>
              <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-cream/50">Email</th>
              <th className="text-center py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-cream/50">Revenue Share %</th>
              <th className="text-center py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-cream/50">Role</th>
              <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider text-cream/50">Joined</th>
            </tr>
          </thead>
          <tbody>
            {creators.map((c) => (
              <tr key={c.id} className="border-b border-tavazi-navy/10 hover:bg-tavazi-slate/20 transition-colors">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center font-display text-xs text-tavazi-dark shrink-0"
                      style={{ background: 'linear-gradient(135deg, #D4A853, #C49B48)' }}
                    >
                      {c.avatar_initials}
                    </div>
                    <span className="text-sm font-medium text-cream">{c.name}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-sm text-cream/60">{c.email}</td>
                <td className="py-4 px-4 text-center">
                  <EditableShareCell creator={c} onSaved={fetchCreators} />
                </td>
                <td className="py-4 px-4 text-center">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                      c.role === 'admin'
                        ? 'bg-gold-accent/10 text-gold-accent'
                        : 'bg-tavazi-navy/10 text-tavazi-navy'
                    }`}
                  >
                    {c.role}
                  </span>
                </td>
                <td className="py-4 px-4 text-sm text-cream/50">
                  {new Date(c.created_at).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md bg-tavazi-charcoal border border-tavazi-navy/20 rounded-xl p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-cream/40 hover:text-cream transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-display text-lg text-cream mb-6">Add New Creator</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-cream/50 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-tavazi-slate border border-tavazi-navy/20 rounded-lg px-4 py-3 text-sm text-cream placeholder-cream/30 focus:outline-none focus:ring-2 focus:ring-tavazi-navy/50"
                  placeholder="Full name"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-cream/50 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full bg-tavazi-slate border border-tavazi-navy/20 rounded-lg px-4 py-3 text-sm text-cream placeholder-cream/30 focus:outline-none focus:ring-2 focus:ring-tavazi-navy/50"
                  placeholder="creator@example.com"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-cream/50 mb-2">
                  Revenue Share %
                </label>
                <input
                  type="number"
                  value={newShare}
                  onChange={(e) => setNewShare(e.target.value)}
                  min={0}
                  max={100}
                  className="w-full bg-tavazi-slate border border-tavazi-navy/20 rounded-lg px-4 py-3 text-sm text-cream placeholder-cream/30 focus:outline-none focus:ring-2 focus:ring-tavazi-navy/50"
                  placeholder="65"
                />
              </div>
              <button
                onClick={handleAddCreator}
                disabled={creating}
                className="w-full py-3 bg-tavazi-navy text-tavazi-dark font-semibold rounded-lg transition-all hover:bg-[#339AF0] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creating ? 'Creating...' : 'Add Creator & Send Invite'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
