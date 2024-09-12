class RecintosZoo {
    recintos = [
        { numero: 1, bioma: 'savana', tamanhoTotal: 10, animaisExistentes: ["MACACO", "MACACO", "MACACO"], tamanhoDisponivel: 7 },
        { numero: 2, bioma: 'floresta', tamanhoTotal: 5, animaisExistentes: [], tamanhoDisponivel: 5 },
        { numero: 3, bioma: 'savana e rio', tamanhoTotal: 7, animaisExistentes: ["GAZELA"], tamanhoDisponivel: 5 },
        { numero: 4, bioma: 'rio', tamanhoTotal: 8, animaisExistentes: [], tamanhoDisponivel: 8 },
        { numero: 5, bioma: 'savana', tamanhoTotal: 9, animaisExistentes: ["LEAO"], tamanhoDisponivel: 6 },
    ];

    animais = [
        { especie: 'LEAO', tamanho: 3, bioma: ['savana'], carnivoro: true },
        { especie: 'LEOPARDO', tamanho: 2, bioma: ['savana'], carnivoro: true },
        { especie: 'CROCODILO', tamanho: 3, bioma: ['rio'], carnivoro: true },
        { especie: 'MACACO', tamanho: 1, bioma: ['savana', 'floresta'], carnivoro: false },
        { especie: 'GAZELA', tamanho: 2, bioma: ['savana'], carnivoro: false },
        { especie: 'HIPOPOTAMO', tamanho: 4, bioma: ['savana', 'rio'], carnivoro: false },
    ];

    analisaRecintos(especie, quantidade) {
        let animalEscolhido;
        const recintosViaveis = [];

        try {
            animalEscolhido = this.animais.find((a) => a.especie === especie);
            if (!animalEscolhido) throw new Error("Animal inválido");
        } catch (error) {
            return { erro: error.message, recintosViaveis: null };
        }

        if (isNaN(quantidade) || quantidade <= 0) {
            return { erro: "Quantidade inválida", recintosViaveis: null };
        }

        for (const recinto of this.recintos) {
            const recintoValido = this.verificarRecinto(animalEscolhido, quantidade, recinto);
            if (recintoValido) {
                let espacoRestante = recintoValido.tamanhoDisponivel - (animalEscolhido.tamanho * quantidade);
                
                if (recinto.animaisExistentes.length > 0 && !recinto.animaisExistentes.every(a => a === especie)) {
                    espacoRestante -= 1;
                }

                recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${espacoRestante} total: ${recinto.tamanhoTotal})`);
            }
        }

        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável", recintosViaveis: null };
        }

        return { erro: null, recintosViaveis: recintosViaveis.sort((a, b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0])) };
    }

    verificarRecinto(animal, quantidade, recinto) {
        if (recinto.bioma === 'savana e rio') {
            if (!animal.bioma.includes('savana') && !animal.bioma.includes('rio')) {
                return false;
            }
        } else if (!animal.bioma.includes(recinto.bioma)) {
            return false;
        }

        const espacoNecessario = animal.tamanho * quantidade;
        if (recinto.tamanhoDisponivel < espacoNecessario) {
            return false;
        }

        if (animal.carnivoro) {
            if (recinto.animaisExistentes.some((especieExistente) => especieExistente !== animal.especie)) {
                return false;
            }
        } else {
            if (recinto.animaisExistentes.some((especieExistente) => {
                const animalExistente = this.animais.find((a) => a.especie === especieExistente);
                return animalExistente.carnivoro;
            })) {
                return false;
            }
        }

        if (animal.especie === 'HIPOPOTAMO' && recinto.bioma !== 'savana e rio') {
            return false;
        }

        if (animal.especie === 'MACACO' && recinto.animaisExistentes.length === 0 && quantidade < 2) {
            return false;
        }

        return recinto;
    }
}

export { RecintosZoo as RecintosZoo };
