"use client";

import { useEffect, useState } from "react";
import { NextPage } from "next";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import PaymentList from "../components/PaymentList"; // Компонент для отображения
import CreatePayment from "../components/CreatePayment"; // Компонент для создания платежа
import Deposit from "../components/Deposit"; // Импортируем новый компонент Deposit
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth"; // Импортируем хук для чтения данных из контракта

const Page: NextPage = () => {
  const { address, isConnected } = useAccount();
  const [contractBalance, setContractBalance] = useState<string>("0");

  // Получение баланса контракта, используя адрес пользователя
  const { data: balance } = useScaffoldReadContract({
    contractName: "PaymentContract", // Имя контракта
    functionName: "getBalance", // Имя функции для получения баланса
    watch: true, // Следим за изменениями
    enabled: isConnected, // Запрос будет выполнен только если пользователь подключен
  });

  useEffect(() => {
    if (balance) {
      setContractBalance(ethers.formatEther(balance)); // Форматируем баланс в ETH
    }
  }, [balance]);

  useEffect(() => {
    if (isConnected) {
      console.log("Пользователь подключен: ", address);
    }
  }, [isConnected, address]);

  const handleDeposit = () => {
    // Обновляем баланс после депозита
    if (balance) {
      setContractBalance(ethers.formatEther(balance)); // Обновляем баланс
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Управление платежами</h1>
      <Deposit onDeposit={handleDeposit} /> {/* Передаем функцию обновления баланса */}
      <CreatePayment contractBalance={contractBalance} /> {/* Передаем текущий баланс в компонент создания платежа */}
      <PaymentList /> {/* Компонент для отображения списка платежей */}
    </div>
  );
};

export default Page;