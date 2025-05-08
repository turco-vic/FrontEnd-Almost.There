"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pagination } from "antd";
import CountryCard from "../../components/CountryCard";
import CountryModal from "../../components/CountryModal";
import Loading from "../../components/Loading";
import styles from "./Countries.module.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const regions = ["africa", "americas", "antarctic", "asia", "europe", "oceania"];
const ITEMS_PER_PAGE = 20;

async function fetchComCache(url) {
  const cache = sessionStorage.getItem(cacheKey);
  if (cache) {
    console.log("🔁 Usando cache:");
    return JSON.parse(cache);
  }

  try {
    const response = await axios.get(url, {});
    const data = response.data;

    console.log("🌐 Buscando da API:");
    sessionStorage.setItem(cacheKey, JSON.stringify(data));
    return data;
  } catch (error) {
    console.error("❌ Erro ao buscar:", error);
    throw error;
  }
}

export default function Countries() {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [allCountries, setAllCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchCountries = async (region = "") => {
    setIsLoading(true);
    try {
      const url = region
        ? `https://restcountries.com/v3.1/region/${region}`
        : "https://restcountries.com/v3.1/all";
      const cacheKey = region ? `countries_${region}` : "countries_all";
      const data = await fetchComCache(url, cacheKey);
      setCountries(data);
      if (!region) {
        setAllCountries(data);
      }
    } catch (error) {
      console.error("Erro ao carregar países:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const resetFilter = () => fetchCountries();

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCountries = countries.slice(startIndex, endIndex);

  const handleCountryClick = (name) => {
    toast.info(` ${name}`, {
    });
}

  return (
    <div className={styles.container}>
      <ToastContainer position="top-right"
                autoClose={1000}
                theme="dark"
            />
      <h1>Lista de Países do Mundo</h1>
      <div>
        {regions.map((region) => (
          <button
            key={region}
            className={styles.button}
            onClick={() => {
            fetchCountries(region)
            handleCountryClick("Você clicou na região: " + region.charAt(0).toUpperCase() + region.slice(1))}}
          >
            {region.charAt(0).toUpperCase() + region.slice(1)}
          </button>
        ))}
        <button className={styles.buttonReset} onClick={resetFilter}>
          Mostrar Todos
        </button>
      </div>

      <div className={styles.cardContainer}>
        {isLoading ? (
          <Loading />
        ) : (
          currentCountries.map((country, index) => (
            <CountryCard
              key={index}
              country={country}
              onClick={() => setSelectedCountry(country)}
            />
          ))
        )}
      </div>

      {!isLoading && (
        <Pagination
          current={currentPage}
          total={countries.length}
          pageSize={ITEMS_PER_PAGE}
          onChange={(page) => setCurrentPage(page)}
          className={styles.pagination}
          showSizeChanger={false}
        />
      )}

      {selectedCountry && (
        <CountryModal
          country={selectedCountry}
          onClose={() => setSelectedCountry(null)}
        />
      )}
    </div>
  );
}
