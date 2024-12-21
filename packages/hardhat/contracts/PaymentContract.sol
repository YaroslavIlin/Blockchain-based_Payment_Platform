// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title Смарт-контракт для приема произвольных платежей
 * @dev Позволяет пользователям отправлять эфир и владельцу контракта выводить средства
 */
contract PaymentContract {
    address public owner;

    // Событие для отслеживания платежей
    event PaymentReceived(address indexed from, uint256 amount);
    event FundsWithdrawn(address indexed to, uint256 amount);
    event PaymentSent(address indexed from, address indexed to, uint256 amount); // Событие для отслеживания отправленных платежей

    constructor() {
        owner = msg.sender; // Устанавливаем владельца контракта
    }

    /**
     * @dev Функция для получения эфира.
     * Эта функция может быть вызвана любым пользователем для отправки эфира на адрес контракта.
     */
    receive() external payable {
        require(msg.value > 0, "You must send some ether");
        emit PaymentReceived(msg.sender, msg.value);
    }

    /**
     * @dev Функция для пополнения баланса контракта.
     * Эта функция может быть вызвана любым пользователем для отправки эфира на адрес контракта.
     */
    function deposit() public payable {
        require(msg.value > 0, "You must send some ether");
        emit PaymentReceived(msg.sender, msg.value);
    }

    /**
     * @dev Функция для вывода средств владельцем контракта.
     * @param _amount Сумма, которую нужно вывести.
     */
    function withdraw(uint256 _amount) public {
        require(msg.sender == owner, "Only the owner can withdraw funds");
        require(address(this).balance >= _amount, "Insufficient balance in contract");

        payable(owner).transfer(_amount);
        emit FundsWithdrawn(owner, _amount);
    }

    /**
    * @dev Функция для отправки эфира на указанный адрес.
    * @param _to Адрес, на который нужно отправить эфир.
    * @param _amount Сумма, которую нужно отправить.
    */
    function pay(address payable _to, uint256 _amount) public payable { // Добавлен модификатор payable
        require(_to != address(0), "Invalid address");
        require(address(this).balance >= _amount, "Insufficient balance in contract");
        require(msg.value >= _amount, "Insufficient value sent"); // Проверка, что отправлено достаточно эфира

        // Используем call для отправки эфира, что позволяет избежать проблем с возвратом
        (bool success, ) = _to.call{value: _amount}("");
        require(success, "Transfer failed");

        emit PaymentSent(msg.sender, _to, _amount); // Используем msg.sender вместо _from
    }

    /**
     * @dev Функция для получения текущего баланса контракта.
     * @return Баланс контракта в wei.
     */
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @dev Функция для проверки, достаточно ли средств на контракте для выполнения платежа.
     * @param _amount Сумма, которую нужно проверить.
     * @return true, если средств достаточно, иначе false.
     */
    function hasSufficientBalance(uint256 _amount) public view returns (bool) {
        return address(this).balance >= _amount;
    }
}