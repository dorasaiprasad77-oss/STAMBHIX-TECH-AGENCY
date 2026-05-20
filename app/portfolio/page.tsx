'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';



interface ProjectMediaItem {
  _id: string;
  projectName: string;
  description: string;
  mediaType: string;
  imageUrl: string;
  images: string[];
  videoUrl: string;
  thumbnailUrl: string;
  category: string;
  client: string;
  completionDate: string;
  tags: string[];
  order: number;
  isActive: boolean;
}

const categoryLabels: Record<string, string> = {
  web: 'Web Development',
  app: 'App Development',
  design: 'UI/UX Design',
  seo: 'SEO',
  home: 'Home Services',
  other: 'Other',
};

const categoryIcons: Record<string, string> = {
  web: '💻',
  app: '📱',
  design: '🎨',
  seo: '📈',
  home: '🏠',
  other: '✨',
};

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function PortfolioPage() {
  const [projects, setProjects] = useState<ProjectMediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<ProjectMediaItem | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);


  useEffect(() => {
    fetch(`/api/project-media`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load projects');
        return res.json();
      })
      .then((json) => {
        setProjects(json.data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const categories = ['all', ...new Set(projects.map((p) => p.category))];
  const filteredProjects = activeCategory === 'all'
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-primary">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-40 left-1/3 w-[600px] h-[600px] bg-[#D4A853]/8 rounded-full blur-[120px]" />
          <div className="absolute inset-0 grid-pattern opacity-20" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1.5 rounded-full border border-[#D4A853]/20 bg-[#D4A853]/5 text-[#D4A853] text-sm font-medium tracking-wide mb-6"
          >Our Portfolio</motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary mb-6 leading-tight"
          >
            Projects We&apos;ve{' '}
            <span className="gold-text-gradient">Delivered</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-secondary text-lg max-w-3xl mx-auto leading-relaxed"
          >
            From digital platforms to design systems — explore the projects that showcase our expertise and craftsmanship.
          </motion.p>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="relative py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'gold-gradient text-black'
                    : 'bg-card border border-primary text-secondary hover:text-primary hover:border-[#D4A853]/30'
                }`}
              >
                {cat === 'all' ? 'All Projects' : `${categoryIcons[cat] || '✨'} ${categoryLabels[cat] || cat}`}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-2xl bg-card border border-primary overflow-hidden animate-pulse">
                  <div className="aspect-video bg-card-hover" />
                  <div className="p-5">
                    <div className="w-32 h-5 bg-card-hover rounded mb-2" />
                    <div className="w-full h-3 bg-inset rounded mb-1" />
                    <div className="w-2/3 h-3 bg-inset rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <p className="text-secondary text-sm mb-2">Could not load projects.</p>
              <p className="text-tertiary text-xs">Add project media via the admin panel at <span className="text-[#D4A853]">/admin/content</span></p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">📁</div>
              <p className="text-secondary text-lg mb-2">No projects found{activeCategory !== 'all' ? ' in this category' : ''}.</p>
              <p className="text-tertiary text-sm">Add project media via the <span className="text-[#D4A853]">/admin/content</span> panel.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, i) => (
                <FadeIn key={project._id} delay={i * 0.05}>
                  <div
                    className="group rounded-2xl bg-card border border-primary hover:border-[#D4A853]/20 transition-all duration-500 overflow-hidden cursor-pointer"
                    onClick={() => { setSelectedProject(project); setGalleryIndex(0); }}
                  >
                    {/* Media Preview */}
                    <div className="relative aspect-video bg-card-hover overflow-hidden">
                      {(() => {
                        const projectImages = project.images?.length > 0 ? project.images : [project.imageUrl].filter(Boolean);
                        if (project.mediaType === 'video' || project.mediaType === 'both') {
                          if (project.thumbnailUrl) {
                            return <img src={project.thumbnailUrl} alt={project.projectName}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />;
                          }
                          return (
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-4xl mb-2">▶</div>
                                <p className="text-tertiary text-xs">Click to view video</p>
                              </div>
                            </div>
                          );
                        }
                        if (projectImages.length > 0) {
                          return <img src={projectImages[0]} alt={project.projectName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />;
                        }
                        return (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-5xl mb-2">{categoryIcons[project.category] || '📄'}</div>
                              <p className="text-tertiary text-xs">{project.projectName}</p>
                            </div>
                          </div>
                        );
                      })()}
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="text-primary text-sm font-medium bg-black/50 px-4 py-2 rounded-lg">
                          View Details
                        </span>
                      </div>
                      {/* Category badge */}
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-xs text-primary">
                        {categoryIcons[project.category] || '✨'} {categoryLabels[project.category] || project.category}
                      </div>
                      {/* Media type badge */}
                      {(project.mediaType === 'video' || project.mediaType === 'both') && (
                        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center">
                          <span className="text-primary text-xs">▶</span>
                        </div>
                      )}
                      {/* Multiple images badge */}
                      {project.images?.length > 1 && (
                        <div className="absolute bottom-3 right-3 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-xs text-primary flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {project.images.length}
                        </div>
                      )}
                    </div>
                    {/* Info */}
                    <div className="p-5">
                      <h3 className="text-primary font-semibold mb-1 group-hover:text-[#D4A853]/90 transition-colors">
                        {project.projectName}
                      </h3>
                      {project.client && (
                        <p className="text-tertiary text-xs mb-2">Client: {project.client}</p>
                      )}
                      {project.description && (
                        <p className="text-secondary text-sm leading-relaxed line-clamp-2">{project.description}</p>
                      )}
                      {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {project.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="px-2 py-0.5 rounded-lg bg-card-hover border border-primary text-tertiary text-[10px]">
                              {tag}
                            </span>
                          ))}
                          {project.tags.length > 3 && (
                            <span className="text-tertiary text-[10px]">+{project.tags.length - 3}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-primary border border-primary rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Media Display */}
              <div className="relative aspect-video bg-card-hover rounded-t-2xl overflow-hidden">
                {(() => {
                  const isVideo = selectedProject.mediaType === 'video' || selectedProject.mediaType === 'both';
                  const projectImages = selectedProject.images?.length > 0 ? selectedProject.images : [selectedProject.imageUrl].filter(Boolean);

                  if (isVideo && selectedProject.videoUrl) {
                    return (
                      <iframe
                        src={selectedProject.videoUrl}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={selectedProject.projectName}
                      />
                    );
                  }

                  if (projectImages.length > 0 && galleryIndex < projectImages.length) {
                    return <img src={projectImages[galleryIndex]} alt={`${selectedProject.projectName} ${galleryIndex + 1}`}
                      className="w-full h-full object-cover" />;
                  }

                  if (isVideo) {
                    return <div className="w-full h-full flex items-center justify-center text-6xl">▶</div>;
                  }

                  return (
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                      {categoryIcons[selectedProject.category] || '📄'}
                    </div>
                  );
                })()}

                {/* Gallery navigation */}
                {(() => {
                  const projectImages = selectedProject.images?.length > 0 ? selectedProject.images : [selectedProject.imageUrl].filter(Boolean);
                  if (projectImages.length > 1) {
                    return (
                      <>
                        {galleryIndex > 0 && (
                          <button
                            onClick={(e) => { e.stopPropagation(); setGalleryIndex(galleryIndex - 1); }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-primary hover:bg-black/80 transition-all"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                        )}
                        {galleryIndex < projectImages.length - 1 && (
                          <button
                            onClick={(e) => { e.stopPropagation(); setGalleryIndex(galleryIndex + 1); }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-primary hover:bg-black/80 transition-all"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        )}
                        {/* Dots indicator */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                          {projectImages.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={(e) => { e.stopPropagation(); setGalleryIndex(idx); }}
                              className={`w-2 h-2 rounded-full transition-all ${
                                idx === galleryIndex ? 'bg-[#D4A853] w-4' : 'bg-white/40 hover:bg-white/60'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    );
                  }
                  return null;
                })()}

                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-primary hover:bg-black/80 transition-all"
                >
                  ✕
                </button>
                <div className="absolute top-3 left-3 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm text-xs text-primary">
                  {categoryIcons[selectedProject.category] || '✨'} {categoryLabels[selectedProject.category] || selectedProject.category}
                </div>
              </div>
              {/* Details */}
              <div className="p-6">
                <h2 className="text-2xl font-bold text-primary mb-2">{selectedProject.projectName}</h2>
                {selectedProject.client && (
                  <p className="text-secondary text-sm mb-4">
                    <span className="text-tertiary">Client:</span> {selectedProject.client}
                  </p>
                )}
                {selectedProject.description && (
                  <p className="text-secondary leading-relaxed mb-4">{selectedProject.description}</p>
                )}
                <div className="flex flex-wrap gap-4 text-sm">
                  {selectedProject.completionDate && (
                    <span className="text-tertiary">
                      Completed: {new Date(selectedProject.completionDate).toLocaleDateString('en-IN', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      })}
                    </span>
                  )}
                  {selectedProject.mediaType && (
                    <span className="text-tertiary capitalize">
                      Type: {selectedProject.mediaType}
                    </span>
                  )}
                </div>
                {selectedProject.tags && selectedProject.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {selectedProject.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 rounded-lg bg-card-hover border border-primary text-tertiary text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
