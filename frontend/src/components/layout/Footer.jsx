import { Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
    return (
        <footer className="border-t border-border/40 bg-background py-12">
            <div className="container px-4 md:px-6">
                <div className="grid gap-8 md:grid-cols-4">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                <Briefcase className="h-4 w-4" />
                            </div>
                            <span className="font-bold">JobPortal</span>
                        </div>
                        <p className="text-sm text-muted-foreground w-full max-w-xs">
                            Connecting talent with opportunity. The most trusted platform for job seekers and employers.
                        </p>
                    </div>
                    <div>
                        <h3 className="mb-4 text-sm font-semibold">Product</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="/jobs" className="hover:text-foreground">Browse Jobs</Link></li>
                            <li><Link to="/companies" className="hover:text-foreground">Companies</Link></li>
                            <li><Link to="/salaries" className="hover:text-foreground">Salaries</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="mb-4 text-sm font-semibold">Company</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="/about" className="hover:text-foreground">About Us</Link></li>
                            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
                            <li><Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="mb-4 text-sm font-semibold">Social</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-foreground">Twitter</a></li>
                            <li><a href="#" className="hover:text-foreground">LinkedIn</a></li>
                            <li><a href="#" className="hover:text-foreground">Instagram</a></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} JobPortal Inc. All rights reserved.
                </div>
            </div>
        </footer>
    );
};
