'use client';

import { useState } from 'react';
import styles from '@/app/homepage.module.css';

export default function NewsletterCTA() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => {
        setEmail('');
        setSubmitted(false);
      }, 3000);
    }
  };

  return (
    <section className={styles.newsletterSection}>
      <div className={styles.newsletterContainer}>
        <h2 className={styles.newsletterTitle}>STAY IN THE GAME</h2>
        <p className={styles.newsletterDesc}>
          Get weekly updates on top performances, championship highlights, and the stories shaping Philadelphia high school sports
        </p>
        <form className={styles.newsletterForm} onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Your email address"
            className={styles.newsletterInput}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className={styles.newsletterBtn}>
            {submitted ? 'Subscribed!' : 'Subscribe'}
          </button>
        </form>
      </div>
    </section>
  );
}
