import config from "@payload-config";
import { getPayload } from "payload";
import { initDatabase } from './config/db';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const MAX_RETRIES = 3;

const categories = [
    {
      name: "All",
      slug: "all",
    },
    {
      name: "Business & Money",
      color: "#FFB347",
      slug: "business-money",
      subcategories: [
        { name: "Accounting", slug: "accounting" },
        {
          name: "Entrepreneurship",
          slug: "entrepreneurship",
        },
        { name: "Gigs & Side Projects", slug: "gigs-side-projects" },
        { name: "Investing", slug: "investing" },
        { name: "Management & Leadership", slug: "management-leadership" },
        {
          name: "Marketing & Sales",
          slug: "marketing-sales",
        },
        { name: "Networking, Careers & Jobs", slug: "networking-careers-jobs" },
        { name: "Personal Finance", slug: "personal-finance" },
        { name: "Real Estate", slug: "real-estate" },
      ],
    },
    {
      name: "Software Development",
      color: "#7EC8E3",
      slug: "software-development",
      subcategories: [
        { name: "Web Development", slug: "web-development" },
        { name: "Mobile Development", slug: "mobile-development" },
        { name: "Game Development", slug: "game-development" },
        { name: "Programming Languages", slug: "programming-languages" },
        { name: "DevOps", slug: "devops" },
      ],
    },
    {
      name: "Writing & Publishing",
      color: "#D8B5FF",
      slug: "writing-publishing",
      subcategories: [
        { name: "Fiction", slug: "fiction" },
        { name: "Non-Fiction", slug: "non-fiction" },
        { name: "Blogging", slug: "blogging" },
        { name: "Copywriting", slug: "copywriting" },
        { name: "Self-Publishing", slug: "self-publishing" },
      ],
    },
    {
      name: "Other",
      slug: "other",
    },
    {
      name: "Education",
      color: "#FFE066",
      slug: "education",
      subcategories: [
        { name: "Online Courses", slug: "online-courses" },
        { name: "Tutoring", slug: "tutoring" },
        { name: "Test Preparation", slug: "test-preparation" },
        { name: "Language Learning", slug: "language-learning" },
      ],
    },
    {
      name: "Self Improvement",
      color: "#96E6B3",
      slug: "self-improvement",
      subcategories: [
        { name: "Productivity", slug: "productivity" },
        { name: "Personal Development", slug: "personal-development" },
        { name: "Mindfulness", slug: "mindfulness" },
        { name: "Career Growth", slug: "career-growth" },
      ],
    },
    {
      name: "Fitness & Health",
      color: "#FF9AA2",
      slug: "fitness-health",
      subcategories: [
        { name: "Workout Plans", slug: "workout-plans" },
        { name: "Nutrition", slug: "nutrition" },
        { name: "Mental Health", slug: "mental-health" },
        { name: "Yoga", slug: "yoga" },
      ],
    },
    {
      name: "Design",
      color: "#B5B9FF",
      slug: "design",
      subcategories: [
        { name: "UI/UX", slug: "ui-ux" },
        { name: "Graphic Design", slug: "graphic-design" },
        { name: "3D Modeling", slug: "3d-modeling" },
        { name: "Typography", slug: "typography" },
      ],
    },
    {
      name: "Drawing & Painting",
      color: "#FFCAB0",
      slug: "drawing-painting",
      subcategories: [
        { name: "Watercolor", slug: "watercolor" },
        { name: "Acrylic", slug: "acrylic" },
        { name: "Oil", slug: "oil" },
        { name: "Pastel", slug: "pastel" },
        { name: "Charcoal", slug: "charcoal" },
      ],
    },
    {
      name: "Music",
      color: "#FFD700",
      slug: "music",
      subcategories: [
        { name: "Songwriting", slug: "songwriting" },
        { name: "Music Production", slug: "music-production" },
        { name: "Music Theory", slug: "music-theory" },
        { name: "Music History", slug: "music-history" },
      ],
    },
    {
      name: "Photography",
      color: "#FF6B6B",
      slug: "photography",
      subcategories: [
        { name: "Portrait", slug: "portrait" },
        { name: "Landscape", slug: "landscape" },
        { name: "Street Photography", slug: "street-photography" },
        { name: "Nature", slug: "nature" },
        { name: "Macro", slug: "macro" },
      ],
    },
  ]

  const seed = async () => {
    try {
      // Initialize database connection first
      await initDatabase();
      
      const payload = await getPayload({config});
      console.log('Starting to seed categories...');

      // First, delete all existing categories
      try {
        console.log('Clearing existing categories...');
        await payload.delete({
          collection: "categories",
          where: {} // This will match all documents
        });
        await delay(1000); // Wait 1 second after deletion
      } catch (error) {
        console.error('Failed to clear categories:', error);
      }

      for (const category of categories) {
        let retries = 0;
        let parentCategory;

        while (retries < MAX_RETRIES && !parentCategory) {
          try {
            console.log(`Creating category: ${category.name}`);
            parentCategory = await payload.create({
              collection: "categories",
              data: {
                name: category.name,
                slug: category.slug,
                color: category.color,
                parent: null,
              }
            });
            await delay(500); // Wait 500ms between parent category creations
          } catch (error) {
            retries++;
            console.error(`Failed to create category ${category.name}, attempt ${retries}:`, error);
            if (retries < MAX_RETRIES) {
              await delay(1000 * retries); // Exponential backoff
            }
          }
        }

        if (!parentCategory) {
          console.error(`Failed to create category ${category.name} after ${MAX_RETRIES} attempts, skipping subcategories`);
          continue;
        }

        if (category.subcategories?.length) {
          for (const subCategory of category.subcategories) {
            let subRetries = 0;
            let success = false;

            while (subRetries < MAX_RETRIES && !success) {
              try {
                console.log(`Creating subcategory: ${subCategory.name}`);
                await payload.create({
                  collection: "categories",
                  data: {
                    name: subCategory.name,
                    slug: subCategory.slug,
                    parent: parentCategory.id,
                  },
                });
                success = true;
                await delay(200); // Wait 200ms between subcategory creations
              } catch (error) {
                subRetries++;
                console.error(`Failed to create subcategory ${subCategory.name}, attempt ${subRetries}:`, error);
                if (subRetries < MAX_RETRIES) {
                  await delay(1000 * subRetries); // Exponential backoff
                }
              }
            }
          }
        }
      }
      
      console.log('Seeding completed successfully!');
    } catch (error) {
      console.error('Seeding failed:', error);
      process.exit(1);
    }
  }

  seed()
    .then(() => {
      console.log('Seed script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seed script failed:', error);
      process.exit(1);
    });