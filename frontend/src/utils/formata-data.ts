export default function formataData(dateString: string) {
    return new Date(dateString).toLocaleDateString("pt-BR")
};
