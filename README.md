# CrossCheck:
Rapid, Reproducible, and Interpretable Model Evaluation

# [Live Demo](https://pnnl.github.io/crosscheck/)

# Abstract

Evaluation beyond aggregate performance metrics, e.g. F-score, is crucial to both establish an appropriate level of trust in machine learning models and identify avenues for future model improvements.
In this paper we demonstrate `CrossCheck`, an interactive capability for rapid cross-model comparison and reproducible error analysis.

We describe the tool, discuss design and implementation details, and present three NLP use cases  -- named entity recognition, reading comprehension, and clickbait detection that show the benefits of using the tool for model evaluation. `CrossCheck` enables users to make informed decisions when choosing between multiple models, identify when the models are correct and for which examples, investigate whether the models are making the same mistakes as humans, evaluate models' generalizability and highlight models' limitations, strengths and weaknesses. Furthermore, `CrossCheck` is implemented as a Jupyter widget, which allows for rapid and convenient integration into existing model development workflows.

# Authors
* Dustin Arendt
* Zhuanyi Shaw
* Prasha Shrestha
* Ellyn Ayton
* Maria Glenski
* Svitlana Volkova


# Usage
See the following Jupyter notebooks:
* https://github.com/pnnl/crosscheck/blob/master/notebooks/Iris%20Demo.ipynb
* https://github.com/pnnl/crosscheck/blob/master/notebooks/twenty-newsgroups/newsgroups.ipynb

# Installation
```sh
pip install crosscheck-widget
```

# How to cite
```
@inproceedings{arendt2021crosscheck,
  title={CrossCheck:
Rapid, Reproducible, and Interpretable Model Evaluation},
  author={Arendt, Dustin and Shaw, Zhuanyi and Shrestha, Prasha and Ayton, Ellyn and Glenski, Maria and Volkova, Svitlana},
  booktitle={Proceedings of the Second Workshop on Data Science with Human in the Loop: Language Advances},
  year={2021}
}
```
