
# Repo2Resume

## 📌 **Inspiration**
Many students face challenges in effectively summarizing their projects for resumes, often missing opportunities to highlight their skills and achievements. This inspired us to create **Repo2Resume**, a tool that simplifies and automates the process, enabling students to confidently present their projects while saving time.

---

## 💡 **What It Does**

### **1. GitHub Repository to Resume**
- Accepts a GitHub repository as input.
- Generates a resume-friendly summary using the **STAR method** (Situation, Task, Action, Result).
- Highlights the project's purpose, key features, technologies used, and measurable outcomes.

### **2. Tailored Cover Letter**
- Creates personalized cover letters based on:
  - Job description.
  - Required skills.
  - Desired role.
  - Company details.
- Ensures a professional, customized application.

### **3. Tinder-Like Job Search**
- Provides an engaging, Tinder-style interface for job discovery.
- Leverages a **vector database** to match users with relevant job opportunities based on their resume.

---

## 🔧 **How We Built It**

### **GitHub to Resume Conversion**
- **Model:** Utilized the **GPT-4o Mini model**, fine-tuned on a dataset of 50 samples.
- **Approach:** Integrated strict prompting to ensure outputs followed the STAR method format.

### **Tailored Cover Letter Creation**
- **Model:** Used GPT-4o Mini with inputs such as job descriptions, skills, roles, and company details.
- **Output:** Delivered professional, personalized cover letters.

### **Tinder-Style Job Search**
- **Vector Database:** Employed **Pinecone** for semantic search and retrieval.
- **Text Embedding:** Used Hugging Face models to encode text for efficient matching.

### **Frontend Development**
- **Framework:** Built with **React.js** for dynamic user interfaces.
- **Styling:** Designed with **Tailwind CSS** for a modern, responsive look.

### **Deployment**
- **Backend:** Dockerized and deployed using **Render**.
- **Frontend:** Deployed on **AWS** with **Terraform** for scalable, automated infrastructure.

---

## 🏆 **Accomplishments**
- **Winner of Best Software and Best Use of Terraform at GoatHacks 2025**.
- Successfully developed and launched a functioning platform with all core features.

---

## 🚀 **What's Next for Repo2Resume**
The project is ongoing, and future plans include:
1. **Skill Suggestions:**
   - Recommend skills, frameworks, and technologies when analyzing GitHub repositories.
2. **Enhanced AI Model Fine-Tuning:**
   - Improve accuracy while keeping costs manageable for students.
3. **Job Market Insights:**
   - Provide additional data on job trends and tailored recommendations.

---

## 🛠️ **Built With**
- **Technologies:**  
  `React.js`, `TypeScript`, `TailwindCSS`, `Python`, `FastAPI`, `Docker`, `Terraform`
- **AI/ML Tools:**  
  `Hugging Face`, `OpenAI`, `Pinecone`
- **Deployment:**  
  `AWS`, `Render`

---

## 🌐 **Try It Out**
- **Website:** [Repo2Resume](https://repo2resume.vercel.app/)  
- **GitHub:** [Repo2Resume Repository](https://github.com/PhuongCT1105/Repo2Resume)  
- **Docker Hub:** [Repo2Resume on Docker Hub](https://hub.docker.com)  

---

## 📢 **Contribute**
We welcome contributions to improve and expand Repo2Resume! Check out the [GitHub repository](https://github.com/PhuongCT1105/Repo2Resume) for more details.
