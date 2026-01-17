import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { Sparkles } from 'lucide-react';

export const Sidebar = ({ role, title, description, navItems }) => {
    return (
        <aside className="sticky top-24 hidden h-[calc(100vh-7rem)] w-64 shrink-0 rounded-2xl border border-border bg-card p-5 shadow-lg lg:block">
            <div className="mb-8 pb-6 border-b border-border">
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded-lg bg-primary/10">
                        <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-wider text-primary">
                        {role === 'EMPLOYER'
                            ? 'Recruiter Workspace'
                            : role === 'ADMIN'
                                ? 'Admin Console'
                                : 'Candidate Portal'}
                    </p>
                </div>

                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                    {title}
                </h1>
                {description && (
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {description}
                    </p>
                )}
            </div>
            <nav className="space-y-1" aria-label="Dashboard navigation">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                cn(
                                    'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                                    isActive
                                        ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                )
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <Icon className={cn("h-4 w-4 shrink-0 transition-transform group-hover:scale-110", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-accent-foreground")} />
                                    <span>{item.label}</span>
                                </>
                            )}
                        </NavLink>
                    );
                })}
            </nav>
        </aside>
    );
};
