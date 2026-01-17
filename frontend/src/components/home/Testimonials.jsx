import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const testimonials = [
    {
        content: "I found my dream job as a Senior React Developer within a week of using JobPortal. The AI matching is incredible.",
        author: "Sarah Jenkins",
        role: "Senior Frontend Engineer",
        company: "TechFlow",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
    {
        content: "As a recruiter, the quality of candidates I receive through this platform is unmatched. It saves us weeks of filtering.",
        author: "Michael Chen",
        role: "Head of Talent",
        company: "Innovate Inc",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    },
    {
        content: "The clean interface and easy application process make job hunting actually enjoyable. Highly recommended!",
        author: "Emily Rodriguez",
        role: "Product Designer",
        company: "DesignCo",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    },
];

export const Testimonials = () => {
    return (
        <section className="py-24 bg-slate-50 dark:bg-zinc-900/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-4">
                        Trusted by Professionals
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Hear from people who have transformed their careers with us.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white dark:bg-zinc-900 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-zinc-800 relative hover:shadow-lg transition-shadow duration-300"
                        >
                            <Quote className="absolute top-8 right-8 w-8 h-8 text-primary/10" />

                            <div className="flex items-center gap-4 mb-6">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.author}
                                    className="w-12 h-12 rounded-full bg-slate-100 dark:bg-zinc-800"
                                />
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                                        {testimonial.author}
                                    </h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {testimonial.role} at {testimonial.company}
                                    </p>
                                </div>
                            </div>

                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed italic">
                                "{testimonial.content}"
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
