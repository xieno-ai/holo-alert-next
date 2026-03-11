import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '../.env.local') })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN!,
  apiVersion: '2024-07-11',
  useCdn: false,
})

const body = [
  { _type: 'block', _key: 'b01', style: 'normal', markDefs: [], children: [{ _type: 'span', _key: 's01', text: 'If you are over 50 and worried about high cholesterol, you are not alone. Nearly 40% of adults in this age group have cholesterol levels that put them at risk of coronary heart disease. The good news? You can lower your blood cholesterol level with simple changes that actually work. This guide cuts through the myths and shows you proven ways to improve your heart health.', marks: [] }] },
  { _type: 'block', _key: 'b02', style: 'h2', markDefs: [], children: [{ _type: 'span', _key: 's02', text: 'Understanding Your Cholesterol Numbers', marks: [] }] },
  { _type: 'block', _key: 'b03', style: 'normal', markDefs: [], children: [{ _type: 'span', _key: 's03', text: 'Your blood cholesterol level includes several important numbers:', marks: [] }] },
  { _type: 'block', _key: 'b04', style: 'normal', listItem: 'bullet', level: 1, markDefs: [], children: [{ _type: 'span', _key: 's04', text: 'LDL ("bad cholesterol"): Carries cholesterol to your arteries where it builds up. High LDL increases your risk of heart attacks and stroke.', marks: [] }] },
  { _type: 'block', _key: 'b05', style: 'normal', listItem: 'bullet', level: 1, markDefs: [], children: [{ _type: 'span', _key: 's05', text: 'HDL ("good cholesterol"): Removes cholesterol from your arteries and takes it to your liver. Higher HDL protects your heart health.', marks: [] }] },
  { _type: 'block', _key: 'b06', style: 'normal', listItem: 'bullet', level: 1, markDefs: [], children: [{ _type: 'span', _key: 's06', text: 'Triglycerides: Blood fats that often go up when LDL is high, adding to your risk of coronary heart disease.', marks: [] }] },
  { _type: 'block', _key: 'b07', style: 'h3', markDefs: [], children: [{ _type: 'span', _key: 's07', text: 'Why Age 50+ Matters', marks: [] }] },
  { _type: 'block', _key: 'b08', style: 'normal', listItem: 'bullet', level: 1, markDefs: [], children: [{ _type: 'span', _key: 's08', text: 'Hormones change and affect how your body handles cholesterol', marks: [] }] },
  { _type: 'block', _key: 'b09', style: 'normal', listItem: 'bullet', level: 1, markDefs: [], children: [{ _type: 'span', _key: 's09', text: 'Metabolism slows down and years of poor eating habits catch up', marks: [] }] },
  { _type: 'block', _key: 'b10', style: 'normal', listItem: 'bullet', level: 1, markDefs: [], children: [{ _type: 'span', _key: 's10', text: 'Risk of heart disease and stroke increases significantly', marks: [] }] },
  { _type: 'block', _key: 'b11', style: 'h2', markDefs: [], children: [{ _type: 'span', _key: 's11', text: '7 Common Myths That Hurt Your Progress', marks: [] }] },
  { _type: 'block', _key: 'b12', style: 'h3', markDefs: [], children: [{ _type: 'span', _key: 's12', text: 'Myth 1: All Dietary Cholesterol Is Bad', marks: [] }] },
  { _type: 'block', _key: 'b13', style: 'normal', markDefs: [], children: [{ _type: 'span', _key: 's13', text: 'Eggs and shrimp do not raise your blood cholesterol much. Saturated and trans fats are the real problem. Focus on limiting saturated fats in full-fat dairy and fatty meats, and avoid trans fats in processed foods completely.', marks: [] }] },
  { _type: 'block', _key: 'b14', style: 'h3', markDefs: [], children: [{ _type: 'span', _key: 's14', text: 'Myth 2: You Need Medication Right Away', marks: [] }] },
  { _type: 'block', _key: 'b15', style: 'normal', markDefs: [], children: [{ _type: 'span', _key: 's15', text: 'Heart healthy eating and exercise can lower cholesterol by 20-30%. Try lifestyle changes first if your doctor agrees.', marks: [] }] },
  { _type: 'block', _key: 'b16', style: 'h3', markDefs: [], children: [{ _type: 'span', _key: 's16', text: 'Myth 3: Low-Fat Diets Work Best', marks: [] }] },
  { _type: 'block', _key: 'b17', style: 'normal', markDefs: [], children: [{ _type: 'span', _key: 's17', text: 'Good fats actually help your cholesterol levels. Use olive oil and eat nuts instead of cutting all fats.', marks: [] }] },
  { _type: 'block', _key: 'b18', style: 'h3', markDefs: [], children: [{ _type: 'span', _key: 's18', text: 'Myth 4: Exercise Must Be Intense', marks: [] }] },
  { _type: 'block', _key: 'b19', style: 'normal', markDefs: [], children: [{ _type: 'span', _key: 's19', text: 'Walking 30 minutes a day, five days a week improves your cholesterol numbers. You do not need to run marathons.', marks: [] }] },
  { _type: 'block', _key: 'b20', style: 'h3', markDefs: [], children: [{ _type: 'span', _key: 's20', text: 'Myth 5: Supplements Work as Well as Diet Changes', marks: [] }] },
  { _type: 'block', _key: 'b21', style: 'normal', markDefs: [], children: [{ _type: 'span', _key: 's21', text: 'Real food works better than pills. Focus on eating right before trying supplements.', marks: [] }] },
  { _type: 'block', _key: 'b22', style: 'h2', markDefs: [], children: [{ _type: 'span', _key: 's22', text: 'Foods That Lower Cholesterol', marks: [] }] },
  { _type: 'block', _key: 'b23', style: 'normal', listItem: 'bullet', level: 1, markDefs: [], children: [{ _type: 'span', _key: 's23', text: 'High-fiber options (aim for 10-25g daily): oats, oat bran, beans, lentils, apples, pears, barley, quinoa', marks: [] }] },
  { _type: 'block', _key: 'b24', style: 'normal', listItem: 'bullet', level: 1, markDefs: [], children: [{ _type: 'span', _key: 's24', text: 'Healthy fats: olive oil, salmon, mackerel, sardines, walnuts, almonds, avocados', marks: [] }] },
  { _type: 'block', _key: 'b25', style: 'normal', listItem: 'bullet', level: 1, markDefs: [], children: [{ _type: 'span', _key: 's25', text: 'Heart-protective foods: fresh vegetables, berries, citrus fruits, green tea, dark chocolate (70% cacao, small amounts)', marks: [] }] },
  { _type: 'block', _key: 'b26', style: 'h3', markDefs: [], children: [{ _type: 'span', _key: 's26', text: 'Foods to Limit or Avoid', marks: [] }] },
  { _type: 'block', _key: 'b27', style: 'normal', listItem: 'bullet', level: 1, markDefs: [], children: [{ _type: 'span', _key: 's27', text: 'High saturated fats: full-fat dairy, fatty red meat, butter, lard, processed meats like bacon', marks: [] }] },
  { _type: 'block', _key: 'b28', style: 'normal', listItem: 'bullet', level: 1, markDefs: [], children: [{ _type: 'span', _key: 's28', text: 'Trans fats (avoid completely): partially hydrogenated oils, store-bought cookies, some margarines, fried fast foods', marks: [] }] },
  { _type: 'block', _key: 'b29', style: 'normal', listItem: 'bullet', level: 1, markDefs: [], children: [{ _type: 'span', _key: 's29', text: 'Highly processed foods: sugary drinks, white bread, white rice, packaged snacks with added sugars', marks: [] }] },
  { _type: 'block', _key: 'b30', style: 'h2', markDefs: [], children: [{ _type: 'span', _key: 's30', text: 'Exercise That Works for Adults Over 50', marks: [] }] },
  { _type: 'block', _key: 'b31', style: 'normal', listItem: 'bullet', level: 1, markDefs: [], children: [{ _type: 'span', _key: 's31', text: 'Cardio: 150 minutes per week of brisk walking, swimming, bike riding, or dancing', marks: [] }] },
  { _type: 'block', _key: 'b32', style: 'normal', listItem: 'bullet', level: 1, markDefs: [], children: [{ _type: 'span', _key: 's32', text: 'Strength training: 2-3 times per week using light weights, resistance bands, or body weight exercises', marks: [] }] },
  { _type: 'block', _key: 'b33', style: 'normal', listItem: 'bullet', level: 1, markDefs: [], children: [{ _type: 'span', _key: 's33', text: 'Daily movement: take stairs, park farther away, garden, or do housework', marks: [] }] },
  { _type: 'block', _key: 'b34', style: 'h2', markDefs: [], children: [{ _type: 'span', _key: 's34', text: 'Your 30-Day Action Plan', marks: [] }] },
  { _type: 'table', _key: 't01', rows: [{ _type: 'row', _key: 'r01', cells: ['Target', 'Goal'] }, { _type: 'row', _key: 'r02', cells: ['Total Cholesterol', 'Under 200'] }, { _type: 'row', _key: 'r03', cells: ['LDL', 'Under 100'] }, { _type: 'row', _key: 'r04', cells: ['HDL', 'Over 50 (women), Over 40 (men)'] }, { _type: 'row', _key: 'r05', cells: ['Triglycerides', 'Under 150'] }] },
  { _type: 'block', _key: 'b35', style: 'normal', listItem: 'bullet', level: 1, markDefs: [], children: [{ _type: 'span', _key: 's35', text: 'Week 1: Replace white bread with whole grain, add oats to breakfast, walk 20 minutes after dinner, track what you eat', marks: [] }] },
  { _type: 'block', _key: 'b36', style: 'normal', listItem: 'bullet', level: 1, markDefs: [], children: [{ _type: 'span', _key: 's36', text: 'Week 2: Eat fish twice, use olive oil instead of butter, walk 25 minutes daily, try one new healthy recipe', marks: [] }] },
  { _type: 'block', _key: 'b37', style: 'normal', listItem: 'bullet', level: 1, markDefs: [], children: [{ _type: 'span', _key: 's37', text: 'Week 3: Add strength exercises twice, fill half your plate with vegetables, walk 30 minutes daily', marks: [] }] },
  { _type: 'block', _key: 'b38', style: 'normal', listItem: 'bullet', level: 1, markDefs: [], children: [{ _type: 'span', _key: 's38', text: 'Week 4: Keep up your exercise routine, focus on portion sizes, schedule a cholesterol test', marks: [] }] },
  { _type: 'block', _key: 'b39', style: 'h2', markDefs: [], children: [{ _type: 'span', _key: 's39', text: 'Sample Day of Heart Healthy Eating', marks: [] }] },
  { _type: 'block', _key: 'b40', style: 'normal', listItem: 'bullet', level: 1, markDefs: [], children: [{ _type: 'span', _key: 's40', text: 'Breakfast: Oatmeal with chopped walnuts and berries', marks: [] }] },
  { _type: 'block', _key: 'b41', style: 'normal', listItem: 'bullet', level: 1, markDefs: [], children: [{ _type: 'span', _key: 's41', text: 'Morning snack: Apple slices with almond butter', marks: [] }] },
  { _type: 'block', _key: 'b42', style: 'normal', listItem: 'bullet', level: 1, markDefs: [], children: [{ _type: 'span', _key: 's42', text: 'Lunch: Large salad with chickpeas, avocado, and olive oil dressing', marks: [] }] },
  { _type: 'block', _key: 'b43', style: 'normal', listItem: 'bullet', level: 1, markDefs: [], children: [{ _type: 'span', _key: 's43', text: 'Afternoon snack: Small handful of nuts', marks: [] }] },
  { _type: 'block', _key: 'b44', style: 'normal', listItem: 'bullet', level: 1, markDefs: [], children: [{ _type: 'span', _key: 's44', text: 'Dinner: Baked salmon with roasted vegetables and brown rice', marks: [] }] },
  { _type: 'block', _key: 'b45', style: 'h2', markDefs: [], children: [{ _type: 'span', _key: 's45', text: 'When to See Your Doctor', marks: [] }] },
  { _type: 'block', _key: 'b46', style: 'normal', listItem: 'bullet', level: 1, markDefs: [], children: [{ _type: 'span', _key: 's46', text: 'Your cholesterol stays high after 3 months of lifestyle changes', marks: [] }] },
  { _type: 'block', _key: 'b47', style: 'normal', listItem: 'bullet', level: 1, markDefs: [], children: [{ _type: 'span', _key: 's47', text: 'You experience chest pain or shortness of breath', marks: [] }] },
  { _type: 'block', _key: 'b48', style: 'normal', listItem: 'bullet', level: 1, markDefs: [], children: [{ _type: 'span', _key: 's48', text: 'You have high blood pressure, diabetes, or heart disease runs in your family', marks: [] }] },
  { _type: 'block', _key: 'b49', style: 'h2', markDefs: [], children: [{ _type: 'span', _key: 's49', text: 'The Bottom Line', marks: [] }] },
  { _type: 'block', _key: 'b50', style: 'normal', markDefs: [], children: [{ _type: 'span', _key: 's50', text: 'You can lower your cholesterol levels after 50 without extreme diets or hours of exercise. Focus on eating more fiber-rich foods and healthy fats, limiting saturated and trans fats, and moving your body 30 minutes most days. Small changes add up to big results - start with one change today. Always talk to your doctor before making big changes to your diet or exercise routine.', marks: [] }] },
]

client.patch('blog-685d8ef719713f79c539a6a2').set({ body }).commit()
  .then(() => console.log('✅ Patched successfully'))
  .catch((e) => console.error('❌', e))
