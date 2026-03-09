import { useState, useEffect } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import ReactMarkdown from 'react-markdown';
import { useLanguage } from '../i18n/useLanguage';

const TermsOfService = () => {
	const { language } = useLanguage();
	const [content, setContent] = useState('');

	useEffect(() => {
		fetch(`/legal/terms-${language}.md`)
			.then(res => {
				if (!res.ok) throw new Error('Not found');
				return res.text();
			})
			.then(text => setContent(text))
			.catch(() => {
				fetch('/legal/terms-en.md')
					.then(res => res.text())
					.then(text => setContent(text));
			});
	}, [language]);

	return (
		<div className="min-h-screen bg-bg-primary text-text-primary flex flex-col">
			<Header />
			<main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
				<div className="prose prose-invert prose-headings:text-text-primary prose-p:text-text-secondary prose-strong:text-text-primary prose-li:text-text-secondary max-w-none">
					<ReactMarkdown>{content}</ReactMarkdown>
				</div>
			</main>
			<Footer showTOS={false}/>
		</div>
	)
}

export default TermsOfService;
