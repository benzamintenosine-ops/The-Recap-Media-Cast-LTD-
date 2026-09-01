import { NewsArticle, AdBanner } from '../types';

export const INITIAL_NEWS: NewsArticle[] = [];

export const INITIAL_ADS: AdBanner[] = [
  {
    id: 'ad-top-1',
    title: 'The Recap Global Media App Download',
    sponsorName: 'THE RECAP MEDIA CAST LTD',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
    targetUrl: '#',
    placement: 'header_top',
    active: true
  },
  {
    id: 'ad-side-1',
    title: 'Smart Cloud Hosting 50% Off',
    sponsorName: 'Apex Cloud Solutions',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
    targetUrl: '#',
    placement: 'sidebar',
    active: true
  },
  {
    id: 'ad-article-1',
    title: 'Future Tech Summit 2026 Pass',
    sponsorName: 'TechCorp BD',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80',
    targetUrl: '#',
    placement: 'in_article',
    active: true
  }
];
