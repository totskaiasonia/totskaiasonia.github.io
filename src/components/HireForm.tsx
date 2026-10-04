import { useState, type FormEvent } from 'react';
import { person } from '../data/person';
import { postJson } from '../lib/api';
import { getSessionId } from '../lib/session';

const budgets = ['Under $2k', '$2k–$8k', '$8k–$20k', '$20k+', 'Not sure yet'];

export function HireForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok'>('idle');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus('sending');
    try {
      await postJson('/api/leads', {
        name: data.get('name'),
        email: data.get('email'),
        company: data.get('company'),
        budget: data.get('budget'),
        message: data.get('message'),
        sessionId: getSessionId(),
      });
      setStatus('ok');
      form.reset();
    } catch {
      const body = encodeURIComponent(
        `Company: ${data.get('company') || '—'}\nBudget: ${data.get('budget') || '—'}\n\n${data.get('message')}`,
      );
      window.location.href = `mailto:${person.email}?subject=${encodeURIComponent('Project brief from ' + data.get('name'))}&body=${body}`;
      setStatus('ok');
    }
  }

  return (
    <form className="hire-form" onSubmit={onSubmit}>
      <label>
        Name
        <input name="name" required autoComplete="name" />
      </label>
      <label>
        Email
        <input name="email" type="email" required autoComplete="email" />
      </label>
      <label>
        Company
        <input name="company" autoComplete="organization" />
      </label>
      <label>
        Budget
        <select name="budget" defaultValue="">
          <option value="">Select</option>
          {budgets.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </label>
      <label className="hire-span">
        What should we ship?
        <textarea name="message" required rows={5} placeholder="Product, timeline, languages, stack constraints…" />
      </label>
      <div className="hire-span hire-submit">
        <button className="btn" type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Send brief'}
        </button>
        {status === 'ok' ? <p className="hire-ok">Received. I will reply from my email.</p> : null}
      </div>
    </form>
  );
}
