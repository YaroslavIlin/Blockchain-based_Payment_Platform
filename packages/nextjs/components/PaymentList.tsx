import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export default function PaymentList() {
  const [contractBalance, setContractBalance] = useState<string>("0");
  const [payments, setPayments] = useState<any[]>([]); // Массив для хранения платежей

  // Хук для чтения данных из контракта
  const { data: balance } = useScaffoldReadContract({
    contractName: "PaymentContract",
    functionName: "getBalance",
  });

  // Функция для получения списка платежей (если такая функция существует)
  const fetchPayments = async () => {
    // Здесь вы можете добавить логику для получения платежей, если у вас есть такая функция в контракте
    // Например, если у вас есть массив платежей, вы можете получить его здесь
    // setPayments(receivedPayments);
  };

  useEffect(() => {
    if (balance) {
      setContractBalance(ethers.formatEther(balance)); // Форматируем баланс в ETH
    }
    fetchPayments(); // Вызываем функцию для получения платежей
  }, [balance]);

  return (
    <div className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Список платежей</h2>
      <p className="text-xl">Баланс контракта: {contractBalance} ETH</p>
      {payments.length > 0 ? (
        payments.map((payment, index) => (
          <PaymentItem key={index} payment={payment} />
        ))
      ) : (
        <p className="text-xl">Нет активных платежей</p>
      )}
    </div>
  );
}

// Компонент для каждого отдельного платежа
function PaymentItem({ payment }: { payment: any }) {
  const { amount, sender, timestamp } = payment; // Предполагаем, что payment содержит эти поля

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <h3 className="text-xl font-semibold text-black">Платеж: {ethers.formatEther(amount)} ETH</h3>
      <p className="text-black">Отправитель: {sender}</p>
      <p className="text-black">Время: {new Date(timestamp * 1000).toLocaleString()}</p>
    </div>
  );
}