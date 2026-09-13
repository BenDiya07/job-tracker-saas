'use client';

import React, { useState, useEffect } from 'react';
import { API_URL } from '../lib/api';

const SVG = ({ className, d }: { className?: string; d: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={d} />
    </svg>
)

const SearchSVG = ({ className }: { className?: string }) => (
    <SVG className={className} d="M12 2L2 7l10 5 5-10L12 2zm0 12l-5 10 10 5L12 14l-10 5 5 10L12 22" />
);
const SortUpDownSVG = ({ className }: { className?: string }) => (
    <SVG className={className} d="M6 10c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2h-4c-1.1 0-2-.9-2-2v-4zm2-4c0-1.1.9-2 2-2h2c1.1 0 2 .9 2 2v2c0 1.1-.9 2-2 2h-2c-1.1 0-2-.9-2-2v-2zm6 4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2h-4c-1.1 0-2-.9-2-2v-4zm-6 0c0-1.1.9-2 2-2h2c1.1 0 2 .9 2 2v2c0 1.1-.9 2-2 2h-2c-1.1 0-2-.9-2-2v-2zm6-8c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2h-4c-1.1 0-2-.9-2-2v-4zm2 4c0 1.1.9 2 2 2h4c1.1 0 2 .9 2 2v-4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2-2v4zm-6 0c0 1.1.9 2 2 2h2c-1.1 0 2-.9 2-2v-2c0-1.1-.9-2-2-2h-2c1.1 0 2 .9 2-2v2z" />
);
const FilterSVG = ({ className }: { className?: string }) => (
    <SVG className={className} d="M4 6h16M7 12h10m-7 6h4" />
);
const Loader2SVG = ({ className }: { className?: string }) => (
    <SVG className={className} d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83" />
);
const MoonSVG = ({ className }: { className?: string }) => (
    <SVG className={className} d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.5 6.5 0 0 0 21 12.8z" />
);
const SunSVG = ({ className }: { className?: string }) => (
    <SVG className={className} d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32 1.41-1.41" />
);
const CheckCircleSVG = ({ className }: { className?: string }) => (
    <SVG className={className} d="M12 12s4 4.5 4 9" />
);
const XCircleSVG = ({ className }: { className?: string }) => (
    <SVG className={className} d="M9 9l6 6m0-6-6 6" />
);

interface Job {
    id: string;
    position: string;
    company: string;
    status: string;
    createdAt: string;
}

export default function HomePage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [title, setTitle] = useState('');
    const [company, setCompany] = useState('');
    const [status, setStatus] = useState<'applied' | 'interview' | 'offer' | 'rejected'>('applied');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

    // 1. Récupération des données depuis l'API Express
    const fetchJobs = async () => {
        try {
            const res = await fetch(`${API_URL}/api/jobs`);
            if (!res.ok) {
                const errorData = await res.json().catch(() => null);
                throw new Error(errorData?.message || 'Erreur réseau');
            }
            const data = await res.json();
            setJobs(Array.isArray(data) ? data : []);
        } catch (err: any) {
            setError(err.message || "Impossible de se connecter à l'API Job Tracker.");
            setJobs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    // 2. Soumission d'une nouvelle candidature
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !company) return;

        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/jobs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ position: title, company, status }),
            });

            if (res.ok) {
                setTitle('');
                setCompany('');
                setStatus('applied');
                fetchJobs();
            } else {
                const errorData = await res.json();
                console.error("Erreur renvoyée par le serveur :", errorData);
                setError(errorData.error || "L'API a renvoyé une erreur lors de l'ajout.");
            }
        } catch (err) {
            setError("Erreur lors de l'ajout de l'offre.");
        } finally {
            setLoading(false);
        }
    };

    // 3. Calcul des statistiques pour le tableau de bord
    const jobList = Array.isArray(jobs) ? jobs : [];

    const filteredJobs = jobList.filter((job) => {
        const matchesSearch = job.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            job.company.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    const sortedJobs = [...filteredJobs].sort((a, b) => {
        if (sortBy === 'newest') {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

    const pendingCount = filteredJobs.filter(j => j.status === 'applied').length;
    const interviewCount = filteredJobs.filter(j => j.status === 'interview').length;
    const acceptedCount = filteredJobs.filter(j => j.status === 'offer').length;
    const rejectedCount = filteredJobs.filter(j => j.status === 'rejected').length;

    return (
        <main className="app-shell">
            <div className="container">

                {/* Header */}
                <header className="mb-10 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950"> JobTracker</h1>
                        <p className="text-slate-500 mt-1">Gère et pilote tes opportunités professionnelles</p>
                    </div>
                    <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-full text-emerald-800 text-sm font-medium self-start">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        API Connectée à Neon
                    </div>
                </header>

                {error && (
                    <div className="bg-rose-50 text-rose-700 p-4 rounded-xl mb-8 border border-rose-200 font-medium">
                        {error}
                    </div>
                )}

                {/* Tableau de bord - Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                    <div className="card card-strong">
                        <div className="flex items-center gap-3 mb-3">
                            <SearchSVG className="w-5 h-5 text-amber-500" />
                        </div>
                        <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Total candidatures</p>
                        <p className="text-3xl font-bold text-slate-900 mt-1">{jobs.length}</p>
                    </div>
                    <div className="card card-strong">
                        <div className="flex items-center gap-3 mb-3">
                            <MoonSVG className="w-5 h-5 text-amber-500" />
                        </div>
                        <p className="text-sm font-medium text-amber-500 uppercase tracking-wider">En attente</p>
                        <p className="text-3xl font-bold text-slate-900 mt-1">{pendingCount}</p>
                    </div>
                    <div className="card card-strong">
                        <div className="flex items-center gap-3 mb-3">
                            <SunSVG className="w-5 h-5 text-sky-500" />
                        </div>
                        <p className="text-sm font-medium text-sky-500 uppercase tracking-wider">Entretiens</p>
                        <p className="text-3xl font-bold text-slate-900 mt-1">{interviewCount}</p>
                    </div>
                    <div className="card card-strong">
                        <div className="flex items-center gap-3 mb-3">
                            <CheckCircleSVG className="w-5 h-5 text-emerald-500" />
                        </div>
                        <p className="text-sm font-medium text-emerald-500 uppercase tracking-wider">Offres</p>
                        <p className="text-3xl font-bold text-slate-900 mt-1">{acceptedCount}</p>
                    </div>
                    <div className="card card-strong">
                        <div className="flex items-center gap-3 mb-3">
                            <XCircleSVG className="w-5 h-5 text-rose-500" />
                        </div>
                        <p className="text-sm font-medium text-rose-500 uppercase tracking-wider">Refusés</p>
                        <p className="text-3xl font-bold text-slate-900 mt-1">{rejectedCount}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Formulaire d'ajout */}
                    <div className="card card-strong h-fit">
                        <h2 className="section-title mb-4">Ajouter une offre</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Poste</label>
                                <input
                                    type="text"
                                    placeholder="Ex: Développeur Fullstack"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Entreprise</label>
                                <input
                                    type="text"
                                    placeholder="Ex: Google, Start-up..."
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Statut initial</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as any)}
                                    className="select-field"
                                >
                                    <option value="applied">En attente </option>
                                    <option value="interview">Entretien </option>
                                    <option value="offer">Offre </option>
                                    <option value="rejected">Refusé </option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="btn-primary"
                            >
                                Ajouter au suivi
                            </button>
                        </form>
                    </div>

                    {/* Liste des candidatures */}
                    <div className="lg:col-span-2 space-y-3">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">Mes Candidatures</h2>

                        {/* Barre de recherche et filtres */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Rechercher un poste ou une entreprise..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="input-field w-full"
                                />
                            </div>
                            <div>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as any)}
                                    className="select-field"
                                >
                                    <option value="newest">Plus récent d'abord</option>
                                    <option value="oldest">Plus ancien d'abord</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-2">
                                <FilterSVG className="w-4 h-4 text-slate-500" />
                                <span className="text-slate-500 text-sm">Filtrer par statut</span>
                            </div>
                        </div>

                        {loading ? (
                            <div className="text-center py-12">
                                <Loader2SVG className="w-12 h-12 mx-auto mb-4 text-slate-400 animate-spin" />
                                <p className="text-slate-400 text-sm">Chargement des opportunités...</p>
                            </div>
                        ) : sortedJobs.length === 0 ? (
                            <div className="card card-strong text-center">
                                <p className="text-slate-400 text-sm">Aucune offre correspondante. Utilise le formulaire pour commencer !</p>
                            </div>
                        ) : sortedJobs.map((job) => (
                            <div
                                key={job.id}
                                className="card p-5 hover:border-slate-300 transition-all flex flex-col sm:flex-row justify-between items-start gap-3"
                            >
                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                    <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center flex-shrink-0">
                                        <SearchSVG
                                            className="w-5 h-5 text-slate-500"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900 hover:text-blue-600 transition-colors">{job.position}</h3>
                                        <p className="text-slate-400 text-sm mt-0.5">{job.company}</p>
                                    </div>
                                </div>

                                <div className="status-chip w-24 sm:w-auto flex items-center justify-center text-xs font-medium">
                                    {job.status === 'applied' ? (
                                        <span className="bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2 py-0.5">
                                            EN ATTENTE
                                        </span>
                                    ) : job.status === 'interview' ? (
                                        <span className="bg-sky-50 text-sky-700 border border-sky-200 rounded-full px-2 py-0.5">
                                            ENTRETIEN
                                        </span>
                                    ) : job.status === 'offer' ? (
                                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2 py-0.5">
                                            OFFRE
                                        </span>
                                    ) : (
                                        <span className="bg-rose-50 text-rose-700 border border-rose-200 rounded-full px-2 py-0.5">
                                            REFUSÉ
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-slate-400 text-sm">{job.createdAt ? new Date(job.createdAt).toLocaleDateString('fr-FR') : 'Date inconnue'}</span>
                                    <SortUpDownSVG
                                        className="w-4 h-4 text-slate-300 hover:text-slate-500 transition-colors"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </main>
    );
}