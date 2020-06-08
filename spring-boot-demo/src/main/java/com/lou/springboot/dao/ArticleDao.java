package com.lou.springboot.dao;

import com.lou.springboot.entity.Article;

import java.util.List;
import java.util.Map;


public interface ArticleDao {

    List<Article> findArticles(Map<String, Object> map);


    int getTotalArticles(Map<String, Object> map);


    int insertArticle(Article article);


    int updArticle(Article article);


    int delArticle(Integer id);


    Article getArticleById(Integer id);


    int deleteBatch(Object[] id);
}
