# File Structure
Все Views привязываются к адресу или короткому имени, 
и в дальнейшем резолвятся по:
`address`/`name`/`context`

### Специализация `view` по `context`/`name`:
* react
    * `default.jsx` - дефолная view, отображаемая для текущего адреса при рендеринге в React.
        Отображается в Explorer как дефолтный вью для адреса.
* react-list-item
    * `instruction.jsx` - содержимое карточки инструкции, входные props:
        * instruction - инструкция solana
        * transaction - транзакция, содержащая инструкцию
* react-text - текстовая информация об объекте
    * `instruction.jsx` - краткое описание инструкции, отправляемой на адрес программы
    * `name.jsx` - имя программы
