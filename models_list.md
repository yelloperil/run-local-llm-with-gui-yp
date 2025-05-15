# Ollama Models
**Classification based on low-spec hardware: 16GB RAM, Intel 15-1335u CPU, Intel Iris Xe Graphics (No dedicated GPU)*

### **Upper-Limit for 16GB**

1. [ollama run qwen2.5-coder](https://ollama.com/library/qwen2.5-coder)

2. [ollama run codellama:7b](https://ollama.com/library/codellama:7b)

3. [ollama run deepseek-r1:7b](https://ollama.com/library/deepseek-r1:7b)

4. [ollama run codellama:7b-instruct-q40](https://ollama.com/library/codellama:7b-instruct-q40)


### **Lower Latency, Smaller**

1. [ollama run codegemma:2b](https://www.ollama.com/library/codegemma:2b)

2. [ollama run deepseek-r1:1.5b](https://ollama.com/library/deepseek-r1:1.5b)

3. [ollama run granite-code:3b](https://ollama.com/library/granite-code)

4. [ollama run smollm:1.7b](https://ollama.com/library/smollm:1.7b)

5. [ollama run tinyllama](https://ollama.com/library/tinyllama)

6. [ollama run phi4-mini](https://ollama.com/library/phi4-mini) (3.8b)

7. [ollama run phi3.5](https://ollama.com/library/phi3.5) (3.8b)

8. [ollama run phi4-mini-reasoning](https://ollama.com/library/phi4-mini-reasoning) (3.8b)

### **Tiny**

1. [ollama run smollm:135m](https://ollama.com/library/smollm:135m) - *extremely fast responses - but virtually all hallucination : )*

---

## Useful Ollama Comamnds

**Create custom model**
```bash
ollama create custom-model-name -f ./Modelfile
```
**first create new Modelfile with desired params, then run this command in a new folder with the Modelfile*  

---

**List downloaded models**
```bash
ollama list
```

---

**Only model pull, no run**
```bash
ollama pull model-name-version
```

---

**Run code llama + pull if missing**
```bash
ollama run codellama:7b-instruct
```

---

**Start Ollama server**
```bash
ollama serve
```
